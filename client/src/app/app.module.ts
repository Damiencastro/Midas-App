import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './basicFunctionality/account/account.component';
import { ChangePasswordComponent } from './basicFunctionality/change-password/change-password.component';
import { ForgetPasswordComponent } from './basicFunctionality/forget-password/forget-password.component';
import { HomeComponent } from './basicFunctionality/home/home.component';
import { LoginComponent } from './basicFunctionality/login/login.component';
import { RegisterComponent } from './basicFunctionality/register/register.component';
import { ResetPasswordComponent } from './basicFunctionality/reset-password/reset-password.component';
import { RoleComponent } from './basicFunctionality/role/role.component';
import { UsersComponent } from './basicFunctionality/users/users.component';
import { NavbarComponent } from './basicFunctionality/navbar/navbar.component';
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
import { ChartComponent } from './basicFunctionality/chart/chart.component';
import { UserProfileComponent } from './basicFunctionality/user-profile/user-profile.component';
import { AccountProfileComponent } from './basicFunctionality/account-profile/account-profile.component';
import { CalendarComponent } from './basicFunctionality/calendar/calendar.component';
import { DashboardComponent } from './basicFunctionality/dashboard/dashboard.component';
import { UserApplicationFormComponent } from './userComponents/user-application-form/user-application-form.component';
import { ApplicationReviewComponent } from './userComponents/application-review/application-review.component';



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
    ChartComponent,
    UserProfileComponent,
    AccountProfileComponent,
    CalendarComponent,
    DashboardComponent,
    UserApplicationFormComponent,
    ApplicationReviewComponent,
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
    provideAnimationsAsync(),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
