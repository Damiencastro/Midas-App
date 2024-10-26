import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersChartModule } from './adminUsersChart/admin-users-chart.module';
import { AdminExpiredPasswordReportComponent } from './adminExpiredPasswordReport/admin-expired-password-report/admin-expired-password-report.component';



@NgModule({
  declarations: [
    AdminExpiredPasswordReportComponent
  ],
  imports: [
    CommonModule,
    AdminUsersChartModule,
  ]
})
export class AdminModule { }
