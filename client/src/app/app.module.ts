import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
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
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { map } from 'rxjs/operators';


import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient, provideHttpClient } from '@angular/common/http';
import { ChartComponent } from './pages/chart/chart.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AccountProfileComponent } from './pages/account-profile/account-profile.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    RoleComponent,
    UsersComponent,
    NavbarComponent,
    RoleFormComponent,
    RoleListComponent,
    ChartComponent,
    UserProfileComponent,
    AccountProfileComponent,
    CalendarComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatFormField,

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
