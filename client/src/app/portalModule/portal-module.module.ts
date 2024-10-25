import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBusinessGLFunctionsModule } from './adminBusinessGLFunctions/admin-business-glfunctions.module';
import { AdminGeneralLedgerFunctionsModule } from './adminGeneralLedgerFunctions/admin-general-ledger-functions.module';
import { AdminUsersChartModule } from '../adminModule/adminUsersChart/admin-users-chart.module';
import { AccountEventLogComponent } from './accountEventLog/account-event-log.component';
import { AccountLedgerComponent } from './accountLedger/account-ledger.component';
import { ChartOfAccountComponent } from './chartOfAccount/chart-of-account.component';
import { JournalEntryFormComponent } from './journalEntryForm/journal-entry-form.component';
import { JournalEntryReviewComponent } from './journalEntryReview/journal-entry-review.component';
import { PortalDashboardComponent } from './portalDashboard/portal-dashboard.component';


@NgModule({
  declarations: [
    AccountEventLogComponent,
    AccountLedgerComponent,
    ChartOfAccountComponent,
    JournalEntryFormComponent,
    JournalEntryReviewComponent,
    PortalDashboardComponent
  ],
  imports: [
    CommonModule,
    AdminBusinessGLFunctionsModule,
    AdminGeneralLedgerFunctionsModule,
  ]
})
export class PortalModule { }
