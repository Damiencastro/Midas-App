import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, finalize } from 'rxjs/operators';
import { EventBusService, EventType } from '../../services/event-bus.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

interface AccountEvent {
  id: string;
  accountId: string;
  type: AccountEventType;
  userId: string;
  timestamp: Date;
  changes: AccountChange[];
  metadata: AccountEventMetadata;
}

interface AccountChange {
  field: string;
  oldValue: any;
  newValue: any;
}

interface AccountEventMetadata {
  source: EventSource;
  reference?: string;  // e.g., Journal Entry ID
  relatedEvents?: string[];  // IDs of related events
  notes?: string;
  systemGenerated: boolean;
  ipAddress?: string;
  userAgent?: string;
}

enum AccountEventType {
  CREATION = 'CREATION',
  MODIFICATION = 'MODIFICATION',
  DEACTIVATION = 'DEACTIVATION',
  REACTIVATION = 'REACTIVATION',
  BALANCE_UPDATE = 'BALANCE_UPDATE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE'
}

enum EventSource {
  USER_ACTION = 'USER_ACTION',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  SYSTEM = 'SYSTEM',
  AUTOMATION = 'AUTOMATION'
}

@Injectable({
  providedIn: 'root'
})
export class AccountEventFacade {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly eventsSubject = new BehaviorSubject<AccountEvent[]>([]);
  private readonly selectedEventSubject = new BehaviorSubject<AccountEvent | null>(null);

  readonly loading$ = this.loadingSubject.asObservable();
  readonly events$ = this.eventsSubject.asObservable();
  readonly selectedEvent$ = this.selectedEventSubject.asObservable();

  // Derived observables
  readonly eventsByAccount$ = (accountId: string) => this.events$.pipe(
    map(events => events.filter(e => e.accountId === accountId))
  );

  readonly eventsByType$ = (type: AccountEventType) => this.events$.pipe(
    map(events => events.filter(e => e.type === type))
  );

  readonly recentEvents$ = this.events$.pipe(
    map(events => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return events.filter(e => e.timestamp > thirtyDaysAgo);
    })
  );

  constructor(
    private errorHandling: ErrorHandlingService,
    private eventBus: EventBusService
  ) {
    // Subscribe to relevant events
    this.subscribeToAccountEvents();
  }

  /**
   * Log an account event
   */
  logEvent(
    accountId: string,
    type: AccountEventType,
    userId: string,
    changes: AccountChange[],
    metadata: Partial<AccountEventMetadata> = {}
  ): Observable<void> {
    this.loadingSubject.next(true);

    const event: AccountEvent = {
      id: crypto.randomUUID(),
      accountId,
      type,
      userId,
      timestamp: new Date(),
      changes,
      metadata: {
        source: EventSource.USER_ACTION,
        systemGenerated: false,
        ...metadata
      }
    };

    return this.validateEvent(event).pipe(
      switchMap(() => this.saveEvent(event)),
      tap(() => {
        this.eventBus.emit({
          type: EventType.ACCOUNT_EVENT_LOGGED,
          payload: event
        });
      }),
      catchError(this.errorHandling.handleError('logEvent')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Load events for a specific account
   */
  loadAccountEvents(accountId: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.fetchAccountEvents(accountId).pipe(
      tap(events => this.eventsSubject.next(events)),
      catchError(this.errorHandling.handleError('loadAccountEvents')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Get event details
   */
  getEventDetails(eventId: string): Observable<AccountEvent | null> {
    this.loadingSubject.next(true);

    return this.fetchEvent(eventId).pipe(
      tap(event => this.selectedEventSubject.next(event)),
      catchError(this.errorHandling.handleError('getEventDetails', null)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Get account history snapshot
   */
  getAccountSnapshot(accountId: string, date: Date): Observable<AccountEvent[]> {
    return this.eventsByAccount$(accountId).pipe(
      map(events => events.filter(e => e.timestamp <= date)),
      map(events => events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()))
    );
  }

  /**
   * Add note to existing event
   */
  addEventNote(eventId: string, note: string, userId: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.fetchEvent(eventId).pipe(
      switchMap(event => {
        if (!event) {
          return throwError(() => new Error('Event not found'));
        }

        const updatedEvent = {
          ...event,
          metadata: {
            ...event.metadata,
            notes: event.metadata.notes 
              ? `${event.metadata.notes}\n${note} (by ${userId} at ${new Date().toISOString()})`
              : `${note} (by ${userId} at ${new Date().toISOString()})`
          }
        };

        return this.saveEvent(updatedEvent);
      }),
      catchError(this.errorHandling.handleError('addEventNote')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private validateEvent(event: AccountEvent): Observable<boolean> {
    const errors: string[] = [];

    if (!event.accountId) {
      errors.push('Account ID is required');
    }

    if (!event.userId) {
      errors.push('User ID is required');
    }

    if (!event.changes?.length) {
      errors.push('Event must include at least one change');
    }

    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    }

    return of(true);
  }

  // Firebase integration methods - to be implemented
  private saveEvent(event: AccountEvent): Observable<void> {
    // Implement Firestore save
    return of(void 0);
  }

  private fetchEvent(id: string): Observable<AccountEvent | null> {
    // Implement Firestore get
    return of(null);
  }

  private fetchAccountEvents(accountId: string): Observable<AccountEvent[]> {
    // Implement Firestore query
    return of([]);
  }

  private subscribeToAccountEvents(): void {
    this.eventBus.onMany([
      EventType.ACCOUNT_CREATED,
      EventType.ACCOUNT_UPDATED,
      EventType.ACCOUNT_DEACTIVATED,
      EventType.JOURNAL_ENTRY_POSTED
    ]).subscribe(event => {
      this.handleAccountEvent(event);
    });
  }

  private handleAccountEvent(event: any): void {
    switch (event.type) {
      case EventType.ACCOUNT_CREATED:
        this.logEvent(
          event.payload.id,
          AccountEventType.CREATION,
          event.payload.userId,
          [{
            field: 'status',
            oldValue: null,
            newValue: 'ACTIVE'
          }],
          {
            source: EventSource.SYSTEM,
            systemGenerated: true
          }
        ).subscribe();
        break;

      case EventType.JOURNAL_ENTRY_POSTED:
        // Log balance changes from journal entry
        event.payload.transactions.forEach((transaction: any) => {
          this.logEvent(
            transaction.accountId,
            AccountEventType.BALANCE_UPDATE,
            event.payload.userId,
            [{
              field: 'balance',
              oldValue: transaction.previousBalance,
              newValue: transaction.newBalance
            }],
            {
              source: EventSource.JOURNAL_ENTRY,
              reference: event.payload.journalEntryId,
              systemGenerated: true
            }
          ).subscribe();
        });
        break;

      // Add more event handlers
    }
  }
}