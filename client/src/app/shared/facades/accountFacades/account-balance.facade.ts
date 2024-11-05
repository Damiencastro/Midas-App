import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, switchMap, tap } from 'rxjs';
import { EventBusService, EventType } from '../../services/event-bus.service';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { AccountFirestoreService } from '../../services/firestoreService/account-firestore.service';

interface BalanceUpdate {
  accountId: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  reference: string;  // e.g., "JE-2024-001" for journal entry reference
  date: Date;
}

export interface AccountBalance {
  accountId: string;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountBalanceFacade {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly currentBalancesSubject = new BehaviorSubject<Map<string, number>>(new Map());

  readonly loading$ = this.loadingSubject.asObservable();
  readonly currentBalances$ = this.currentBalancesSubject.asObservable();

  constructor(
    private accountFirestore: AccountFirestoreService,
    private errorHandling: ErrorHandlingService,
    private eventBus: EventBusService
  ) {
    // Subscribe to relevant events that might affect balances
    this.eventBus.on(EventType.JOURNAL_ENTRY_APPROVED).subscribe(event => {
      this.handleJournalEntryApproval(event.payload);
    });
  }

  /**
   * Get current balance for a specific account
   */
  getAccountBalance(accountId: string): Observable<number> {
    return this.currentBalances$.pipe(
      map(balances => balances.get(accountId) || 0)
    );
  }

  /**
   * Update account balance based on a transaction
   */
  updateBalance(update: BalanceUpdate): Observable<void> {
    this.loadingSubject.next(true);

    return this.validateBalanceUpdate(update).pipe(
      switchMap(() => this.applyBalanceUpdate(update)),
      tap(() => {
        this.eventBus.emit({
          type: EventType.ACCOUNT_BALANCE_UPDATED,
          payload: update
        });
      }),
      catchError((error) => {return this.errorHandling.handleError('updateBalance', undefined)}),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Get running balance for an account up to a specific date
   */
//   getBalanceAsOf(accountId: string, date: Date): Observable<number> {
//     return this.accountFirestore.getBalanceHistory(accountId).pipe(              // Needs further implementation with event logging service
//       map((history: any[]) => this.calculateBalanceAsOf(history, date)),
//       catchError(this.errorHandling.handleError('getBalanceAsOf', 0))
//     );
//   }

  /**
   * Verify if an account has sufficient balance for a debit
   */
  hasSufficientBalance(accountId: string, amount: number): Observable<boolean> {
    return this.getAccountBalance(accountId).pipe(
      map(balance => balance >= amount),
      catchError((error) => {return this.errorHandling.handleError('hasSufficientBalance', false)})
    );
  }

  /**
   * Refresh all account balances (useful after bulk operations)
   */
  refreshBalances(): Observable<AccountBalance[]> {
    this.loadingSubject.next(true);

    return this.accountFirestore.getAllCurrentBalances().pipe(
      tap(balances => {
        const balanceMap = new Map<string, number>();
        (balances as AccountBalance[]).forEach(b => balanceMap.set(b.accountId, b.balance));
        this.currentBalancesSubject.next(balanceMap);
      }),
      // catchError(this.errorHandling.handleError('refreshBalances')),
      tap(() => this.loadingSubject.next(false))
    );
  }

  private validateBalanceUpdate(update: BalanceUpdate): Observable<boolean> {
    // Implement validation logic
    const errors: string[] = [];

    if (!update.accountId) {
      errors.push('Account ID is required');
    }

    if (update.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!update.reference) {
      errors.push('Transaction reference is required');
    }

    if (errors.length > 0) {
      return new Observable(subscriber => {
        subscriber.error(new Error(errors.join(', ')));
      });
    }

    return new Observable(subscriber => {
      subscriber.next(true);
      subscriber.complete();
    });
  }

  private applyBalanceUpdate(update: BalanceUpdate): Observable<void> {
    return this.updateBalance(
      update
    );
  }

  private calculateBalanceAsOf(history: any[], date: Date): number {
    // Implement balance calculation logic considering transactions up to the given date
    return history
      .filter(h => h.date <= date)
      .reduce((acc, curr) => {
        if (curr.type === 'DEBIT') {
          return acc - curr.amount;
        } else {
          return acc + curr.amount;
        }
      }, 0);
  }

  private handleJournalEntryApproval(journalEntry: any): void {
    // Handle balance updates when a journal entry is approved
    // This would typically trigger multiple balance updates
    this.refreshBalances().subscribe();
  }
}


                                          //---------------------------------------//
                                          /* * * * * Core Balance Methods * * * * */
                                          //--------------------------------------//

    // getBalance(accountId: string): Observable<BalanceDTO>
    // getBalances(accountIds: string[]): Observable<BalanceDTO[]>
    // getRunningBalance(accountId: string, asOf: Date): Observable<BalanceDTO>
    // calculateNetBalance(accountIds: string[]): Observable<NetBalanceResult>
    // verifyBalance(accountId: string): Observable<BalanceVerificationResult>


                                          //---------------------------------------------//
                                          /* * * * * Balance Adjustment Methods * * * * */
                                          //--------------------------------------------//

  // adjustBalance(accountId: string, adjustment: BalanceAdjustmentDTO): Observable<BalanceDTO>
  // recordCorrection(accountId: string, correction: CorrectionDTO): Observable<CorrectionResult>
  // applyAdjustingEntry(adjustment: AdjustingEntryDTO): Observable<AdjustmentResult>
  // reverseAdjustment(adjustmentId: string): Observable<void>


                                          //--------------------------------------------//
                                          /* * * * * Period Management Methods * * * * */
                                          //-------------------------------------------//

  // getBalanceByPeriod(accountId: string, period: AccountingPeriod): Observable<PeriodBalanceDTO>
  // getPeriodBalances(accountId: string, dateRange: DateRange): Observable<PeriodBalanceDTO[]>
  // closeAccountingPeriod(period: AccountingPeriod): Observable<PeriodClosureResult>
  // reopenAccountingPeriod(period: AccountingPeriod): Observable<PeriodReopenResult>
  // rolloverBalances(fromPeriod: AccountingPeriod): Observable<RolloverResult>


                                          //-----------------------------------------//
                                          /* * * * * Reconciliation Methods * * * * */
                                          //----------------------------------------//

  // startReconciliation(accountId: string): Observable<ReconciliationSession>
  // submitReconciliation(session: ReconciliationSession): Observable<ReconciliationResult>
  // getUnreconciled(accountId: string): Observable<UnreconciledItemDTO[]>
  // getLastReconciliation(accountId: string): Observable<ReconciliationDTO>
  // cancelReconciliation(sessionId: string): Observable<void>


                                          //-------------------------------------------//
                                          /* * * * * Balance Analysis Methods * * * * */
                                          //------------------------------------------//

  // analyzeBalanceTrend(accountId: string, dateRange: DateRange): Observable<BalanceTrendAnalysis>
  // detectBalanceAnomalies(accountId: string): Observable<BalanceAnomaly[]>
  // compareBalancePeriods(accountId: string, period1: AccountingPeriod, period2: AccountingPeriod): Observable<BalanceComparisonResult>
  // forecastBalance(accountId: string, forecastParams: ForecastParams): Observable<BalanceForecast>


                                          //---------------------------------------------//
                                          /* * * * * Validation & Rules Methods * * * * */
                                          //--------------------------------------------//

  // validateBalance(accountId: string): Observable<BalanceValidationResult>
  // checkBalanceConstraints(accountId: string): Observable<ConstraintCheckResult>
  // verifyDoubleSidedBalance(): Observable<DoubleEntryValidationResult>
  // validateBalanceSheet(): Observable<BalanceSheetValidationResult>

                                          //--------------------------------------------//
                                          /* * * * * Balance Reporting Methods * * * * */
                                          //-------------------------------------------//

  // generateBalanceReport(reportConfig: BalanceReportConfig): Observable<BalanceReport>
  // exportBalanceHistory(accountId: string, options: ExportOptions): Observable<ExportResult>
  // generateTrialBalance(asOf: Date): Observable<TrialBalanceReport>
  // getBalanceStatements(period: AccountingPeriod): Observable<FinancialStatements>

                                          //--------------------------------------------//
                                          /* * * * * Balance Reporting Methods * * * * */
                                          //-------------------------------------------//

  // generateBalanceReport(reportConfig: BalanceReportConfig): Observable<BalanceReport>
  // exportBalanceHistory(accountId: string, options: ExportOptions): Observable<ExportResult>
  // generateTrialBalance(asOf: Date): Observable<TrialBalanceReport>
  // getBalanceStatements(period: AccountingPeriod): Observable<FinancialStatements>

                                          //-----------------------------------------------//
                                          /* * * * * Potential Interfaces & Enums * * * * */
                                          //----------------------------------------------//

/*
interface BalanceDTO {
  accountId: string;
  currentBalance: number;
  availableBalance: number;
  pendingDebits: number;
  pendingCredits: number;
  lastUpdated: Date;
  status: BalanceStatus;
  reconciled: boolean;
  lastReconciled?: Date;
}

interface BalanceAdjustmentDTO {
  amount: number;
  type: AdjustmentType;
  reason: string;
  documentation?: string;
  effectiveDate: Date;
  referenceNumber?: string;
}

interface PeriodBalanceDTO {
  period: AccountingPeriod;
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  adjustments: BalanceAdjustmentDTO[];
  status: PeriodStatus;
}

interface ReconciliationSession {
  id: string;
  accountId: string;
  startDate: Date;
  endDate: Date;
  startingBalance: number;
  endingBalance: number;
  items: ReconciliationItem[];
  status: ReconciliationStatus;
  adjustments: BalanceAdjustmentDTO[];
}

interface ReconciliationItem {
  transactionId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  status: 'PENDING' | 'MATCHED' | 'UNMATCHED';
  reference?: string;
}

interface BalanceTrendAnalysis {
  dailyTrend: TrendPoint[];
  monthlyTrend: TrendPoint[];
  seasonality?: SeasonalityAnalysis;
  anomalies: BalanceAnomaly[];
  statistics: BalanceStatistics;
}

interface BalanceThreshold {
  accountId: string;
  type: ThresholdType;
  value: number;
  condition: ThresholdCondition;
  notification: NotificationConfig;
}

type BalanceEvents = 
  | 'BALANCE_UPDATED'
  | 'BALANCE_ADJUSTED'
  | 'RECONCILIATION_COMPLETED'
  | 'PERIOD_CLOSED'
  | 'THRESHOLD_BREACHED'
  | 'ANOMALY_DETECTED'
  | 'BALANCE_VERIFIED'
  | 'ADJUSTMENT_REVERSED';
*/