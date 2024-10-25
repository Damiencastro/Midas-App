import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormGroup, FormGroupName, FormsModule } from '@angular/forms';
import { RequestSystemAccessComponent } from './request-system-access/request-system-access.component';



@NgModule({
  declarations: [
    RequestSystemAccessComponent
  ],
  imports: [
    CommonModule,
    MatIcon,
  ]
})
export class RequestSystemAccessModule { }
