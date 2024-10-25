import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserApplicationReviewModule } from './adminUserApplicationReview/admin-user-application-review.module';
import { AdminDashboardModule } from './adminDashboard/admin-dashboard.module';
import { AdminExpiredPasswordReportModule } from './adminExpiredPasswordReport/admin-expired-password-report.module';
import { AdminUsersChartModule } from './adminUsersChart/admin-users-chart.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminDashboardModule,
    AdminExpiredPasswordReportModule,
    AdminUserApplicationReviewModule,
    AdminUsersChartModule,
  ]
})
export class AdminModule { }
