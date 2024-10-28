import { Injectable, OnDestroy, inject } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, collection, doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, first, from, lastValueFrom, map, mergeMap, switchMap, takeUntil } from 'rxjs';
import { Account, AccountFilter, GeneralLedger, JournalEntry } from '../../../dataModels/financialModels/account-ledger.model';
import { addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AccountFirestoreService implements OnDestroy {

  private generalLedgersSubject = new BehaviorSubject<GeneralLedger[] | null>(null);
  private generalLedgerSnapshotSubject = new BehaviorSubject<QuerySnapshot | null>(null);
  private firestore = inject(Firestore);

  private journalEntrySnapshotSubject = new BehaviorSubject<QuerySnapshot | null>(null);
  private journalEntrySnapshot$ = this.journalEntrySnapshotSubject.asObservable();

  generalLedgerSnapshot$ = this.generalLedgerSnapshotSubject.asObservable();
  private destroySubject = new Subject<void>();
  constructor(firestore: Firestore) {
    this.initializeAccountFirestoreService(firestore);
   }

   initializeAccountFirestoreService(firestore: Firestore) {
    //Create subscription to the generalLedgers collection snapshot
    onSnapshot(collection(firestore, 'generalLedger'), (snapshot) => {
      takeUntil(this.destroySubject);
      this.generalLedgersSubject.next(snapshot.docs.map(doc => doc.data() as GeneralLedger));
      this.generalLedgerSnapshotSubject.next(snapshot);
    });
    onSnapshot(collection(firestore, 'journalEntries'), (snapshot: QuerySnapshot) => {
      takeUntil(this.destroySubject);
      this.journalEntrySnapshotSubject.next(snapshot);
    });
   }

   

   getAllAccountsWhere(filter?: AccountFilter): Observable<Account[] | null> {
    return this.generalLedgerSnapshot$.pipe(
      map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
        if (!snapshot) {
          return null;
        }
        
        // First get all accounts
        const accounts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Account));
        
        // If no filter, return all accounts
        if (!filter) {
          return accounts;
        }
        
        // Apply filter
        return accounts.filter(account => {
          // Add your filter logic here
          // Example:
          return filter.category ? account.category === filter.category : true;
        });
      })
    );
  }

    //get account by id
    getAccountById(id: string): Observable<Account | null> {
      return this.generalLedgerSnapshot$.pipe(
        map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
          if (!snapshot) {
            return null;
          }
          const doc = snapshot.docs.find(doc => doc.id === id);
          return doc ? { id: doc.id, ...doc.data() } as Account : null;
        })
      );
    }

    //Get all accounts
    getAllAccounts(): Observable<Account[] | null> {
      return this.getAllAccountsWhere();
    }

    //Create account
    async createAccount(account: Account): Promise<void> {
      console.log(account);
      console.log(this.firestore);
      
      lastValueFrom(this.generalLedgerSnapshot$.pipe(
        first(),
        // Use switchMap instead of map when returning a Promise
        switchMap(snapshot => {
          console.log(snapshot);
          if (!snapshot) {
            throw new Error('No snapshot to create account');
          }
    
          // Check for existing account
          const existingAccount = snapshot.docs.find(doc => doc.id === account.id);
          if (existingAccount) {
            console.log(existingAccount);
            console.log(account);
            throw new Error('Account already exists');
          }
    
          // Create new account
          const accDocRef = collection(this.firestore, 'generalLedger');
          console.log(accDocRef);
          return from(addDoc(accDocRef, account));
        })
      ));
    }

    updateAccount(id: string, account: Partial<Account>): Promise<void> {
      const accountRef = doc(collection(this.firestore, 'generalLedger'), id);
      return updateDoc(accountRef, {
        ...account,
        updatedAt: serverTimestamp()
      });
    }

    //deactivate account
    deactivateAccount(id: string): Promise<void> {
      return this.updateAccount(id, { isActive: false });
    }
  

    ngOnDestroy() {
      this.destroySubject.next();
      this.destroySubject.complete();
    }


    getJournalEntries(accountId?: string, startDate?: Date, endDate?: Date): Observable<JournalEntry[] | null> {
      return this.journalEntrySnapshot$.pipe(
        map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
          if (!snapshot) {
            throw new Error('No snapshot to get journal entries');
          }

          if(!accountId && !startDate && !endDate){
            return snapshot.docs.map(doc => doc.data() as JournalEntry);
          }

          // Filter based on accountId
          const filteredDocs = snapshot.docs.filter(doc => {
            const entry = doc.data() as JournalEntry;
            return entry.transactions.some(transaction => transaction.accountId === accountId);
          });

          // Extract and return the JournalEntry data
          return filteredDocs.map(doc => doc.data() as JournalEntry);
        }),
        map(entries => {
          if (!startDate || !endDate) {
            return entries;
          }

          // Filter based on date range
          return entries.filter(entry => {
            return entry.date >= startDate && entry.date <= endDate;
          });
        })
      );
    }

}
