import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AccountComponent } from './basicFunctionality/account-old/account.component';
import { ChangePasswordComponent } from './basicFunctionality/change-password-old/change-password.component';
import { ForgetPasswordComponent } from './basicFunctionality/forget-password-old/forget-password.component';
import { HomeComponent } from './basicFunctionality/home-old/home.component';
import { LoginComponent } from './basicFunctionality/login-old/login.component';
import { RegisterComponent } from './basicFunctionality/register-old/register.component';
import { ResetPasswordComponent } from './basicFunctionality/reset-password-old/reset-password.component';
import { RoleComponent } from './basicFunctionality/role-old/role.component';
import { UsersComponent } from './basicFunctionality/users-old/users.component';
import { NavbarComponent } from './basicFunctionality/navbar-old/navbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ChartComponent } from './basicFunctionality/chart-old/chart.component';
import { UserProfileComponent } from './basicFunctionality/user-profile-old/user-profile.component';
import { AccountProfileComponent } from './basicFunctionality/account-profile-old/account-profile.component';
import { CalendarComponent } from './basicFunctionality/calendar/calendar.component';
import { DashboardComponent } from './basicFunctionality/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    component: DashboardComponent,
    data: {
      roles : ['Admin', 'Manager', 'Accountant'],
    }
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'user-profile',
    component:UserProfileComponent,
  },
  {
    path: 'account-profile',
    component:AccountProfileComponent,
  },
  {
    path: 'chart',
    component: ChartComponent,
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'roles',
    component: RoleComponent,
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
