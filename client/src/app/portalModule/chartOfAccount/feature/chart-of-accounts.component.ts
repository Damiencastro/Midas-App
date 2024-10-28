import { Component, OnInit, inject } from '@angular/core';
import { ChartOfAccountsService } from '../data-access/chart-of-accounts.service';
import { ChartOfAccountsCard } from '../ui/chart-of-accounts.card';
import { Account } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { AccountFilter } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart-of-accounts',
  template: `
    <div style="width: 100vw; height: 90vh;">
      <chart-of-accounts-card
        [accounts$]="accounts$"
        (selectedAccount)="selectedAccount($event)"
      />
      <button 
        style="width: 30px; height: 7px; color: red; border: 3px; background-color: white;" 
        routerLink="/portal/admin/account-add"
      >
        Create New Account
      </button>
    </div>
  `,
})
export class ChartOfAccountsComponent implements OnInit {
  private chartOfAccountsService = inject(ChartOfAccountsService);
  private router = inject(Router);
  
  // Use BehaviorSubject with initial null value for filter
  private filterSubject = new BehaviorSubject<AccountFilter | null>(null);
  
  // Define accounts$ as an Observable that reacts to filter changes
  accounts$: Observable<Account[] | null> = this.filterSubject.pipe(
    switchMap(filter => this.chartOfAccountsService.getAllAccountsWhere(filter))
  );
  
  constructor() {}

  ngOnInit(): void {
    // No need for additional subscriptions
  }
  
  // Method to update filter if needed
  updateFilter(filter: AccountFilter | null): void {
    this.filterSubject.next(filter);
  }
  
  selectedAccount(account: Account) {
    //Do something with the selected account
  }
}