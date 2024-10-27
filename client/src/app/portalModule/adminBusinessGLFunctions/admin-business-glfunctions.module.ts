import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBusinessGLAssignUsersComponent } from './adminBusinessGLAssignUsers/admin-business-glassign-users/admin-business-glassign-users.component';
import { AdminBusinessGLChartComponent } from './adminBusinessGLChart/admin-business-glchart/admin-business-glchart.component';
import { AdminBusinessGLCreateComponent } from './adminBusinessGLCreate/admin-business-glcreate/admin-business-glcreate.component';
import { AdminBusinessGLDeactivateComponent } from './adminBusinessGLDeactivate/admin-business-gldeactivate/admin-business-gldeactivate.component';
import { AdminBusinessGLEditComponent } from './adminBusinessGLEdit/admin-business-gledit/admin-business-gledit.component';



@NgModule({
  declarations: [
    AdminBusinessGLAssignUsersComponent,
    AdminBusinessGLChartComponent,
    AdminBusinessGLCreateComponent,
    AdminBusinessGLDeactivateComponent,
    AdminBusinessGLEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminBusinessGLFunctionsModule { }
