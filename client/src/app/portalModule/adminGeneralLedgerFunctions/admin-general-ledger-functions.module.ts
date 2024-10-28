import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCreationCard } from './adminAccountCreate/ui/admin-account-creation.card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminGLFuncsRoutingModule } from './admin-gl-funcs-routing.module';
import { AccountCreationComponent } from './adminAccountCreate/feature/admin-account-creation.component';



@NgModule({
  declarations: [
    AccountCreationCard,
    AccountCreationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminGLFuncsRoutingModule
  ]
})
export class AdminGeneralLedgerFunctionsModule { }
