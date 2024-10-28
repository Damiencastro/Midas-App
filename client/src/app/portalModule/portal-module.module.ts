import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGeneralLedgerFunctionsModule } from './adminGeneralLedgerFunctions/admin-general-ledger-functions.module';
import { PortalDashboardComponent } from './portalDashboard/portal-dashboard.component';
import { PortalRoutingModule } from './portal-routing.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { ChartOfAccountsCard } from './chartOfAccount/ui/chart-of-accounts.card';
import { FilterDialogComponent } from './chartOfAccount/utils/account-filter.component';
import { AccountEventLogComponent } from './accountEventLog/feature/account-event-log.component';
import { AccountEventCard } from './accountEventLog/ui/account-event.card';
import { AccountLedgerComponent } from './accountLedger/feature/account-ledger.component';
import { AccountLedgerCard } from './accountLedger/ui/account-ledger.card';
import { ChartOfAccountsComponent } from './chartOfAccount/feature/chart-of-accounts.component';
import { DialogModule } from '@angular/cdk/dialog';
import { JournalEntryReviewComponent } from './journalEntryReview/feature/journal-entry-form.component';
import { JournalReviewCard } from './journalEntryReview/ui/journal-review.card';

@NgModule({
  declarations: [
    JournalEntryReviewComponent,
    JournalReviewCard,
    PortalDashboardComponent,
    ChartOfAccountsCard,
    FilterDialogComponent,
    AccountEventLogComponent,
    AccountEventCard,
    AccountLedgerComponent,
    AccountLedgerCard,
    ChartOfAccountsComponent,

  ],
  imports: [
    CommonModule,
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
    MatCardModule,
    DialogModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class PortalModule { }
