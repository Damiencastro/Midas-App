import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, distinctUntilChanged, shareReplay, Subject, takeUntil, tap, catchError, Observable } from "rxjs";
import { Account, AccountFilter } from "../dataModels/financialModels/account-ledger.model";
import { ErrorHandlingService } from "../services/error-handling.service";
import { EventBusService } from "../services/event-bus.service";
import { AccountFirestoreService } from "../services/firestoreService/account-firestore.service";

interface AccountState {
    accounts: Account[];
    selectedAccount: string | null;
    filters: AccountFilter | null;
    lastUpdated: Date;
  }
  
  @Injectable({ providedIn: 'root' })
  export class AccountingStateService {
    private readonly accountsSubject = new Subject<Account[]>();
    private selectedAccountSubject = new BehaviorSubject<Account[]>([]);
    private filterSubject = new Subject<AccountFilter>();

    private readonly accounts$ = this.accountsSubject.asObservable();
    private readonly filter$ = this.filterSubject.asObservable();

    private destroySubject = new Subject<void>();
    private readonly destroy$ = this.destroySubject.asObservable();
    

    constructor(
      private accountingFirestoreService: AccountFirestoreService,
      private errorHandlingService: ErrorHandlingService,
      private eventBus: EventBusService,

    ) {
      this.initializeAccountingState();
    }

    initializeAccountingState() {
      this.accountingFirestoreService.accounts$.pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          return this.errorHandlingService.handleError(error, [] as Account[]);
        }),
        tap(accounts => this.accountsSubject.next(accounts)),
        
      );
    }
  
    readonly filteredAccounts$ = this.filter$.pipe(
      catchError(error => {return this.errorHandlingService.handleError(error, null)}),
      map(filters => this.applyFilters(filters)),
      distinctUntilChanged(),
      shareReplay(1)
    )
      
    readonly selectedAccount$ = this.selectedAccountSubject.pipe(
      catchError(error => {return this.errorHandlingService.handleError(error, [] as Account[])}),
      distinctUntilChanged()
    );

    applyFilters(filters: AccountFilter | null): Observable<Account[]> {
      return this.accounts$.pipe(
        catchError(error => {return this.errorHandlingService.handleError(error, [] as Account[])}),
        map(accounts => {
          
          return accounts.filter(account => {
            if (!filters) {
              return true; // Include all accounts if no filters
            }
            if (
              (filters.category && account.category !== filters.category) ||
              (filters.subcategory && account.subcategory !== filters.subcategory) ||
              (filters.isActive && account.isActive !== filters.isActive) ||
              (filters.normalSide && account.normalSide !== filters.normalSide)
            ) {
              return false; // Exclude if any filter doesn't match
            }
    
          return true; // Include if all filters match or are not present
          })
        }),
      );
    }
  }
