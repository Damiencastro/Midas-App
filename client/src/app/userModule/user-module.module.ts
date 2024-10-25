import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { ForgotPasswordModule } from './forgotPassword/forgot-password.module';
import { RequestSystemAccessModule } from './requestSystemAccess/request-system-access.module';
import { ProfileModule } from './profile/profile.module';
import { LoginModule } from './login/login.module';
import { InboxModule } from './inbox/inbox.module';
import { HelpGlobalModule } from '../shared/helpFeature/help-global.module';
import { UserModuleRoutingModule } from './user-module-routing.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CalendarModule,
    ForgotPasswordModule,
    RequestSystemAccessModule,
    ProfileModule,
    LoginModule,
    InboxModule,
    HelpGlobalModule,
    UserModuleRoutingModule
  ]
})
export class UserModule { }
