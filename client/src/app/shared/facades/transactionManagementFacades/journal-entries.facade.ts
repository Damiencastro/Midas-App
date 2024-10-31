import { Inject, Injectable, forwardRef, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, finalize } from 'rxjs/operators';
import { EventBusService, EventType } from '../../services/event-bus.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { AccountBalanceFacade } from '../accountFacades/account-balance.facade';
import { JournalEntry } from '../../dataModels/financialModels/account-ledger.model';
import { UserFirestoreService } from '../../services/firestoreService/user-firestore.service';
import { Auth, getAuth } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { QueryConstraint, orderBy, query, where } from 'firebase/firestore';

interface JournalTransaction {
  accountId: string;
  description?: string;
  debitAmount: number;
  creditAmount: number;
}

enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Injectable({
  providedIn: 'root'
})
export class JournalEntryFacade {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly currentEntrySubject = new BehaviorSubject<JournalEntry | null>(null);
  private readonly entriesSubject = new BehaviorSubject<JournalEntry[]>([]);

  readonly loading$ = this.loadingSubject.asObservable();
  readonly currentEntry$ = this.currentEntrySubject.asObservable();
  readonly entries$ = this.entriesSubject.asObservable();

  private firestore = inject(Firestore);

  // Derived observables
  readonly pendingEntries$ = this.entries$.pipe(
    map(entries => entries.filter(e => e.status === JournalEntryStatus.PENDING))
  );

  constructor(
    @Inject(forwardRef(() => AccountBalanceFacade))
    private accountBalanceFacade: AccountBalanceFacade,
    private errorHandling: ErrorHandlingService,
    private eventBus: EventBusService
  ) {}

  /* id: string;
    entryNumber: string;
    date: Date;
    description: string;
    status: JournalEntryStatus;
    
    // Double-entry transactions
    transactions: JournalTransaction[];
    
    // Balancing
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    
    // Metadata
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    postedAt?: Date;
    postedBy?: string;
    
    // Version tracking
    version: number;
    versionHistory: JournalEntryVersionHistory[];
    */

  /**
   * Create a new journal entry
   */
  createJournalEntry(entry: Omit<JournalEntry, 'id' | 'status' | 'createdAt' | 'createdBy'>): Observable<void> {
    this.loadingSubject.next(true);

    const newEntry: JournalEntry = {
      ...entry,
      id: (Math.random() * 1000).toString(), // Hook this into firestore service
      status: JournalEntryStatus.DRAFT,
      createdAt: new Date(),
      createdBy: (Math.random() * 1000).toString()//getAuth().currentUser?.uid, // You'd get this from your auth service
    };

    return this.validateJournalEntry(newEntry).pipe(
      switchMap(() => this.saveJournalEntry(newEntry)),
      tap(() => {
        this.eventBus.emit({
          type: EventType.JOURNAL_ENTRY_CREATED,
          payload: newEntry
        });
      }),
    //   catchError(this.errorHandling.handleError('createJournalEntry')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  selectEntry(entry: JournalEntry): void {
    this.currentEntrySubject.next(entry);
  }

  /**
   * Submit journal entry for approval
   */
  submitForApproval(entryId: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.getJournalEntry(entryId).pipe(
      switchMap(entry => {
        if (!entry) {
          return throwError(() => new Error('Journal entry not found'));
        }

        const updatedEntry = {
          ...entry,
          status: JournalEntryStatus.PENDING
        };

        return this.saveJournalEntry(updatedEntry);
      }),
      tap(() => {
        this.eventBus.emit({
          type: EventType.JOURNAL_ENTRY_SUBMITTED,
          payload: { entryId }
        });
      }),
    //   catchError(this.errorHandling.handleError('submitForApproval')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Approve a journal entry
   */
  approveEntry(entryId: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.getJournalEntry(entryId).pipe(
      switchMap(entry => {
        if (!entry) {
          return throwError(() => new Error('Journal entry not found'));
        }

        const updatedEntry = {
          ...entry,
          status: JournalEntryStatus.APPROVED,
          approvedBy: 'current-user-id', // You'd get this from your auth service
          approvedAt: new Date()
        };

        return this.saveJournalEntry(updatedEntry).pipe(
          switchMap(() => this.postToAccounts(updatedEntry))
        );
      }),
      tap(() => {
        this.eventBus.emit({
          type: EventType.JOURNAL_ENTRY_APPROVED,
          payload: { entryId }
        });
      }),
    //   catchError(this.errorHandling.handleError('approveEntry')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Reject a journal entry
   */
  rejectEntry(entryId: string, reason: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.getJournalEntry(entryId).pipe(
      switchMap(entry => {
        if (!entry) {
          return throwError(() => new Error('Journal entry not found'));
        }

        const updatedEntry = {
          ...entry,
          status: JournalEntryStatus.REJECTED,
          notes: reason
        };

        return this.saveJournalEntry(updatedEntry);
      }),
      tap(() => {
        this.eventBus.emit({
          type: EventType.JOURNAL_ENTRY_REJECTED,
          payload: { entryId, reason }
        });
      }),
    //   catchError(this.errorHandling.handleError('rejectEntry')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Load journal entries with optional filters
   */
  loadEntries(filters?: {
    status?: JournalEntryStatus;
    startDate?: Date;
    endDate?: Date;
}): Observable<JournalEntry[]> {
    this.loadingSubject.next(true);

    return this.fetchJournalEntries(filters).pipe(
        tap(entries => this.entriesSubject.next(entries)),
        finalize(() => this.loadingSubject.next(false))
    );
}

  private validateJournalEntry(entry: JournalEntry): Observable<boolean> {
    const errors: string[] = [];

    // Check required fields
    if (!entry.entryNumber) errors.push('Entry number is required');
    if (!entry.date) errors.push('Date is required');
    if (!entry.description) errors.push('Description is required');
    if (!entry.transactions?.length) errors.push('At least one transaction is required');

    // Validate debits and credits balance
    const totalDebits = entry.transactions.reduce((sum, t) => sum + t.debitAmount, 0);
    const totalCredits = entry.transactions.reduce((sum, t) => sum + t.creditAmount, 0);
    
    if (totalDebits !== totalCredits) {
      errors.push('Total debits must equal total credits');
    }

    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    }

    return of(true);
  }

  private postToAccounts(entry: JournalEntry): Observable<void> {
    const balanceUpdates = entry.transactions.map(transaction => {
      if (transaction.debitAmount > 0) {
        return this.accountBalanceFacade.updateBalance({
          accountId: transaction.accountId,
          amount: transaction.debitAmount,
          type: 'DEBIT',
          reference: entry.entryNumber,
          date: entry.date
        });
      } else {
        return this.accountBalanceFacade.updateBalance({
          accountId: transaction.accountId,
          amount: transaction.creditAmount,
          type: 'CREDIT',
          reference: entry.entryNumber,
          date: entry.date
        });
      }
    });

    return combineLatest(balanceUpdates).pipe(
      map(() => void 0)
    );
  }

  // These methods would interact with your Firestore service
  private saveJournalEntry(entry: JournalEntry): Observable<void> {
    // Implement Firestore save
    return of(void 0);
  }

  private getJournalEntry(id: string): Observable<JournalEntry | null> {
    // Implement Firestore get
    return of(null);
  }

  private fetchJournalEntries(filters?: {
    status?: JournalEntryStatus;
    startDate?: Date;
    endDate?: Date;
}): Observable<JournalEntry[]> {
    // Get reference to Firestore
    const journalCollection = collection(this.firestore, 'journalEntries');

    // Start building query constraints
    const constraints: QueryConstraint[] = [];

    // Add filters if they exist
    if (filters) {
        if (filters.status) {
            constraints.push(where('status', '==', filters.status));
        }
        
        if (filters.startDate) {
            constraints.push(where('date', '>=', filters.startDate));
        }
        
        if (filters.endDate) {
            constraints.push(where('date', '<=', filters.endDate));
        }
    }

    // Add default ordering
    constraints.push(orderBy('date', 'desc'));

    // Create the query
    const journalQuery = query(journalCollection, ...constraints);

    // Return the query result as an observable
    return collectionData(journalQuery).pipe(
        map(entries => entries as JournalEntry[]),
        catchError(error => {
            console.error('Error fetching journal entries:', error);
            return of([]);
        })
    );
}
}