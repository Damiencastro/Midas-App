import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountEventLogModule } from './accountEventLog/account-event-log.module';
import { AccountLedgerModule } from './accountLedger/account-ledger.module';
import { AdminBusinessGLFunctionsModule } from './adminBusinessGLFunctions/admin-business-glfunctions.module';
import { AdminGeneralLedgerFunctionsModule } from './adminGeneralLedgerFunctions/admin-general-ledger-functions.module';
import { AdminUsersChartModule } from '../adminModule/adminUsersChart/admin-users-chart.module';
import { ChartOfAccountModule } from './chartOfAccount/chart-of-account.module';
import { JournalEntryFormModule } from './journalEntryForm/journal-entry-form.module';
import { JournalEntryReviewModule } from './journalEntryReview/journal-entry-review.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountEventLogModule,
    AccountLedgerModule,
    AdminBusinessGLFunctionsModule,
    AdminGeneralLedgerFunctionsModule,
    ChartOfAccountModule,
    JournalEntryFormModule,
    JournalEntryReviewModule
  ]
})
export class PortalModule { }
