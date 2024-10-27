import { Component, OnInit, inject } from '@angular/core';
import { ChartOfAccountsService } from '../data-access/chart-of-accounts.service';
import { ChartOfAccountsCard } from '../ui/chart-of-accounts.card';
import { Account } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { AccountFilter } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { Subject, map } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chart-of-accounts',
  template: `
  <div style="width: 100vw; height: 90vh;">
  <chart-of-accounts-card
    style="width: 80%; height: 60%; background-color: light-gray;"
    [accounts]="accounts$ | async"
    (selectedAccount)="selectedAccount($event)"
  />
  <button style="width: 30px; height: 7px; color: red; border: 3px; background-color: white;" (click)="createNewAccount()">Create New Account</button>
  </div>
  `,
})
export class ChartOfAccountsComponent implements OnInit {

  //Import chart of account service to receive information
  chartOfAccountsService = inject(ChartOfAccountsService);

  //Create subjects to hold the most up to date information from chart of account service
  filterSubject = new Subject<AccountFilter | null>();
  accountsSubject = new Subject<Account[] | null>();
  filter$ = this.filterSubject.asObservable();
  accounts$ = this.accountsSubject.asObservable();

  router = inject(Router);
  
  constructor() {}

  ngOnInit(): void {
    //Subscribe to the chart of account service to get the most up to date information
    this.filter$.subscribe(filter => {
      this.chartOfAccountsService.getAllAccountsWhere(filter).subscribe(accounts => {
        this.accountsSubject.next(accounts);
      })
    })
  }
  
  selectedAccount(account: Account) {
    //Do something with the selected account
  }
  
  createNewAccount() {
    this.router.navigate(['/portal/create-account']);
  }
}
