import { Component, OnInit, inject } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { error } from 'console';
import { UserService } from '../../services/user.service';
import { Auth, getAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {



  passwordHide = true;
  confirmPasswordHide = true;
  mismatch = false;



  formValue !: FormGroup;
  userService = inject(UserService);
  userData !: any;
  showAdd!: boolean;
  showEdit!: boolean;
  currentId: number = 0;


  constructor(private formbuilder: FormBuilder, private router: Router, private auth: Auth) {
    this.formValue = new FormGroup({
      username: new FormControl("",),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl("", [Validators.required],),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      phone: new FormControl("",),
      street: new FormControl("",),
      zip: new FormControl("",),
      state: new FormControl("",),
      role: new FormControl("",),
    },)
  }



  submitApplication() {
    // this.userModelObj.id = this.currentId;
    // this.currentId++;

    // Damien : First, we link the user service's usermodel to the input given by the user.
    this.userService.user.firstname = this.formValue.value.firstname;
    this.userService.user.lastname = this.formValue.value.lastname;
    this.userService.user.phone = this.formValue.value.phone;
    this.userService.user.street = this.formValue.value.street;
    this.userService.user.zip = this.formValue.value.zip;
    this.userService.user.state = this.formValue.value.state;
    this.userService.user.username = this.makeUserName();
    this.userService.user.password = this.formValue.value.password;

    this.userService.create(this.auth);
  }

  makeUserName(): string {
    return this.formValue.value.firstname.charAt(0) + this.formValue.value.lastname;
  }

}



// Creates User Object
