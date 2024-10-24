import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './basicFunctionality/change-password-old/change-password.component';
import { ForgetPasswordComponent } from './basicFunctionality/forget-password-old/forget-password.component';
import { LoginComponent } from './basicFunctionality/login-old/login.component';
import { RegisterComponent } from './basicFunctionality/register-old/register.component';
import { ResetPasswordComponent } from './basicFunctionality/reset-password-old/reset-password.component';
import { UsersComponent } from './basicFunctionality/users-old/users.component';
import { NavbarComponent } from './basicFunctionality/navbar-old/navbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserProfileComponent } from './basicFunctionality/user-profile-old/user-profile.component';
import { CalendarComponent } from './basicFunctionality/calendar/calendar.component';
import { DashboardComponent } from './basicFunctionality/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '',
    component: LoginComponent,
    data: {
      roles : ['Guest']
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
    path: 'user-profile',
    component:UserProfileComponent,
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
    path: 'calendar',
    component: CalendarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
