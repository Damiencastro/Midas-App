import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// import { AccountEventLogComponent } from "./accountEventLog/account-event-log.component";
// import { AccountLedgerComponent } from "./accountLedger/account-ledger.component";
import { ChartOfAccountsComponent } from "./chartOfAccount/feature/chart-of-accounts.component";
import { JournalEntryFormComponent } from "./journalEntryForm/feature/journal-entry-form.component"
// import { JournalEntryReviewComponent } from "./journalEntryReview/journal-entry-review.component";
import { PortalDashboardComponent } from "./portalDashboard/portal-dashboard.component";
import { AuthGuardService } from "../shared/authGuard/auth-guard.service";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'portal-dashboard',
    },
    // {not yet implemented
    //     path: 'event-log',
    //     component: AccountEventLogComponent
    // },
    // {not yet implemented
    //     path: 'account-ledger',
    //     component: AccountLedgerComponent
    // },
    {
        path: 'chart-of-accounts',
        component: ChartOfAccountsComponent
    },
    {
        path: 'journal-entry-form',
        component: JournalEntryFormComponent
    },
    // {not yet implemented
    //     path: 'journal-entry-review',
    //     component: JournalEntryReviewComponent
    // },
    {
        path: 'portal-dashboard',
        canActivate: [AuthGuardService],
        component: PortalDashboardComponent
    },
    // {not yet implemented
    //     path: 'business-gl-functions',
    //     loadChildren: () => import('./adminBusinessGLFunctions/admin-business-glfunctions.module').then(m => m.AdminBusinessGLFunctionsModule)
    // },
    {
        path: 'admin',
        loadChildren: () => import('./adminGeneralLedgerFunctions/admin-general-ledger-functions.module').then(m => m.AdminGeneralLedgerFunctionsModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PortalRoutingModule {}