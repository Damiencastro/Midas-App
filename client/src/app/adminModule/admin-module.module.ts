import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserApplicationReviewModule } from './adminUserApplicationReview/admin-user-application-review.module';
import { AdminDashboardModule } from './adminDashboard/admin-dashboard.module';
import { AdminExpiredPasswordReportModule } from './adminExpiredPasswordReport/admin-expired-password-report.module';
import { AdminUsersChartModule } from './adminUsersChart/admin-users-chart.module';
import { AdminDashboardComponent } from './adminDashboard/admin-dashboard/admin-dashboard.component';
import { AdminExpiredPasswordReportComponent } from './adminExpiredPasswordReport/admin-expired-password-report/admin-expired-password-report.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminExpiredPasswordReportComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardModule,
    AdminExpiredPasswordReportModule,
    AdminUserApplicationReviewModule,
    AdminUsersChartModule,
  ]
})
export class AdminModule { }
