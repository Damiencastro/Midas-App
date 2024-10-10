import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent{


  signInVisible: boolean = true;

  registerObj:  RegisterModel = new RegisterModel();
  loginObj: LoginModel = new LoginModel();

  passwordHide = false;
  confirmPasswordHide = false;
  mismatch = false;

}

// Creates User Object
export class RegisterModel {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  cpassword: string;
  address: string;
  dob: string;
  username: string;

  // creates username from first and lastname
  setUsername(){
    this.username = this.firstname.charAt(0) + this.lastname;
  }


  constructor(){
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.password = '';
    this.cpassword = '';
    this.address = '';
    this.dob = '';
    this.username ="";

  }
}


//receives login
export class LoginModel {
  username: string;
  password: string;

  constructor(){
    this.username = '';
    this.password = '';
  }
}
