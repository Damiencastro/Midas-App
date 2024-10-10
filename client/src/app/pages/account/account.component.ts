import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { UserModel } from './account.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  formValue!: FormGroup;
  constructor(private formbuilder: FormBuilder, private api : ApiService){}
  userModelObj : UserModel = new UserModel;



  ngOnInit(): void {
      this.formValue = this.formbuilder.group({
        firstname: [''],
        lastname: [''],
        email: [''],
        phone: [''],
        street: [''],
        zip: [''],
        state: [''],
      })
  }

  postUserDetails(){
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.firstname = this.formValue.value.firstname;
    this.userModelObj.lastname = this.formValue.value.lastname;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.street = this.formValue.value.street;
    this.userModelObj.zip = this.formValue.value.zip;
    this.userModelObj.state = this.formValue.value.state;

    this.api.postUser(this.userModelObj).subscribe(res=>{
      console.log(res);
      alert("User has been successfully added!")
    },
    err=>{
      alert("User Creation Failed. Please try again.")
    })
  }
}
