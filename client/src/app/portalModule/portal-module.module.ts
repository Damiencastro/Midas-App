import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBusinessGLFunctionsModule } from './adminBusinessGLFunctions/admin-business-glfunctions.module';
import { AdminGeneralLedgerFunctionsModule } from './adminGeneralLedgerFunctions/admin-general-ledger-functions.module';
import { AdminUsersChartModule } from '../adminModule/adminUsersChart/admin-users-chart.module';
import { AccountEventLogComponent } from './accountEventLog/account-event-log.component';
import { AccountLedgerComponent } from './accountLedger/account-ledger.component';
import { ChartOfAccountComponent } from './chartOfAccount/feature/chart-of-account.component';
import { JournalEntryFormComponent } from './journalEntryForm/journal-entry-form.component';
import { JournalEntryReviewComponent } from './journalEntryReview/journal-entry-review.component';
import { PortalDashboardComponent } from './portalDashboard/portal-dashboard.component';
import { PortalRoutingModule } from './portal-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOfAccountsCard } from './chartOfAccount/ui/chart-for-chart-of-accounts.component';

@NgModule({
  declarations: [
    AccountEventLogComponent,
    AccountLedgerComponent,
    ChartOfAccountComponent,
    JournalEntryFormComponent,
    JournalEntryReviewComponent,
    PortalDashboardComponent,
    ChartOfAccountsCard,
  ],
  imports: [
    CommonModule,
    AdminBusinessGLFunctionsModule,
    AdminGeneralLedgerFunctionsModule,
    PortalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule
  ]
})
export class PortalModule { }
