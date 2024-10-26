import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccountEventLogComponent } from "./accountEventLog/account-event-log.component";
import { AccountLedgerComponent } from "./accountLedger/account-ledger.component";
import { ChartOfAccountComponent } from "./chartOfAccount/chart-of-account.component";
import { JournalEntryFormComponent } from "./journalEntryForm/journal-entry-form.component";
import { JournalEntryReviewComponent } from "./journalEntryReview/journal-entry-review.component";
import { PortalDashboardComponent } from "./portalDashboard/portal-dashboard.component";
import { AuthGuardService } from "../shared/authGuard/auth-guard.service";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'portal-dashboard',
    },
    {
        path: 'event-log',
        component: AccountEventLogComponent
    },
    {
        path: 'account-ledger',
        component: AccountLedgerComponent
    },
    {
        path: 'chart-of-account',
        component: ChartOfAccountComponent
    },
    {
        path: 'journal-entry-form',
        component: JournalEntryFormComponent
    },
    {
        path: 'journal-entry-review',
        component: JournalEntryReviewComponent
    },
    {
        path: 'portal-dashboard',
        canActivate: [AuthGuardService],
        component: PortalDashboardComponent
    },
    {
        path: 'portal-dashboard',
        
    },
    {
        path: 'business-gl-functions',
        loadChildren: () => import('./adminBusinessGLFunctions/admin-business-glfunctions.module').then(m => m.AdminBusinessGLFunctionsModule)
    },
    {
        path: 'general-ledger-functions',
        loadChildren: () => import('./adminGeneralLedgerFunctions/admin-general-ledger-functions.module').then(m => m.AdminGeneralLedgerFunctionsModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserModuleRoutingModule {}