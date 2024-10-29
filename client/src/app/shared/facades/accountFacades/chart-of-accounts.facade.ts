import { BehaviorSubject, Observable, catchError, finalize, find, map, switchMap, take, tap, throwError } from "rxjs";
import { Account, AccountFilter } from "../../dataModels/financialModels/account-ledger.model";
import { Injectable } from "@angular/core";
import { AccountFirestoreService } from "../../firestoreService/accountStore/data-access/account-firestore.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { EventBusService, EventType } from "../../services/event-bus.service";

@Injectable({ providedIn: 'root' })
export class ChartOfAccountsFacade {
  private readonly accountsSubject = new BehaviorSubject<Account[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly accounts$ = this.accountsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(
    private accountFirestoreService: AccountFirestoreService,
    private errorHandlingService: ErrorHandlingService,
    private eventBus: EventBusService
  ) {
    // Initialize accounts subscription
    this.loadAccounts();
  }

  loadAccounts(filter?: AccountFilter): Observable<Account[]> {
    this.loadingSubject.next(true);
    
    return this.accountFirestoreService.getAllAccountsWhere(filter).pipe(
      tap(accounts => this.accountsSubject.next((accounts) ? accounts : [])),
      // catchError(this.errorHandlingService.handleError<Account[]>('loadAccounts', [])), Will have to figure this out when Claude has more tokens
      //There was an issue where the catchError function was supposed to take in an Accountp[ called accounts or a null input. It's supposed to then retry if possible and then return an empty array if not possible. For some reason the operator function was not eliminating the null outputs. So, OperatorFunction<Account[] | null, Account[] null> rather than OperatorFunction<Account[] | null, Account[]>
      finalize(() => this.loadingSubject.next(false))
    );
  }

  createAccount(account: Account): Observable<void> {
    this.loadingSubject.next(true);

    return this.validateAccount(account).pipe(
      switchMap(() => this.accountFirestoreService.createAccount(account)),
      tap(() => {
        this.eventBus.emit({
          type: EventType.ACCOUNT_CREATED,
          payload: account
        });
        this.loadAccounts(); // Refresh accounts list
      }),
      // catchError(error => this.errorHandlingService.handleError('createAccount')(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Add more public methods as needed

  private validateAccount(account: Account): Observable<boolean> {
    // Implement account validation logic
    const errors: string[] = [];

    if (!account.accountNumber) {
      errors.push('Account number is required');
    }

    if (!account.accountName) {
      errors.push('Account name is required');
    }

    // Add more validation rules

    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    }

    // Check for duplicate account numbers
    return this.accounts$.pipe(
      take(1),
      map((accounts: Account[]) => {
        const duplicate = accounts.find((a: Account) => a.accountNumber === account.accountNumber);
        if (duplicate) {
          throw new Error('Account number already exists');
        }
        return true;
      })
    );
  }
}