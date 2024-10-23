import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AccountComponent } from './pages/account/account.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RoleComponent } from './pages/role/role.component';
import { UsersComponent } from './pages/users/users.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ChartComponent } from './pages/chart/chart.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AccountProfileComponent } from './pages/account-profile/account-profile.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
