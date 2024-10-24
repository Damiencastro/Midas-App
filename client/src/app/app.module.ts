import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './basicFunctionality/change-password-old/change-password.component';
import { ForgetPasswordComponent } from './basicFunctionality/forget-password-old/forget-password.component';
import { LoginComponent } from './basicFunctionality/login-old/login.component';
import { RegisterComponent } from './basicFunctionality/register-old/register.component';
import { ResetPasswordComponent } from './basicFunctionality/reset-password-old/reset-password.component';
import { UsersComponent } from './basicFunctionality/users-old/users.component';
import { NavbarComponent } from './basicFunctionality/navbar-old/navbar.component';
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
import { UserProfileComponent } from './basicFunctionality/user-profile-old/user-profile.component';
import { CalendarComponent } from './basicFunctionality/calendar/calendar.component';
import { DashboardComponent } from './basicFunctionality/dashboard/dashboard.component';
import { UserApplicationFormComponent } from './userComponents/user-application-form/user-application-form.component';
import { ApplicationReviewComponent } from './userComponents/application-review/application-review.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AdminDashboardComponent } from './adminComponents/adminDashboard/admin-dashboard/admin-dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    UsersComponent,
    NavbarComponent,
    UserProfileComponent,
    CalendarComponent,
    DashboardComponent,
    UserApplicationFormComponent,
    ApplicationReviewComponent,
    AdminDashboardComponent,
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
    provideFirebaseApp(() => initializeApp({"projectId":"midas-app-239bc","appId":"1:880947371935:web:1e02db79c3e04b0be567aa","storageBucket":"midas-app-239bc.appspot.com","apiKey":"AIzaSyBefPwnb0z3xR2KZrgQ11pLVaK4guxiwp8","authDomain":"midas-app-239bc.firebaseapp.com","messagingSenderId":"880947371935"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
