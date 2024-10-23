import { Component, OnInit, inject } from '@angular/core';
import { UserModel } from '../account/account.model';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { error } from 'console';


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
  userModelObj: UserModel = new UserModel();
  userData !: any;
  showAdd!: boolean;
  showEdit!: boolean;
  currentId: number = 0;


  constructor(private formbuilder: FormBuilder, private api: ApiService, private router: Router) {
    this.formValue = new FormGroup({
      username: new FormControl("",),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl("", [Validators.required],),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("",),
      street: new FormControl("",),
      zip: new FormControl("",),
      state: new FormControl("",),
      role: new FormControl("",),
    },)
  }

  ngOnInit(): void {

  //   this.formValue = this.formbuilder.group({
  //     username: [''],
  //     password: ['', [Validators.required, Validators.minLength(8)]],
  //     confirmPassword: [''],
  //     firstname: ['', [Validators.required]],
  //     lastname: ['', [Validators.required]],
  //     email: ['', [Validators.required], Validators.email,],
  //     phone: [''],
  //     street: [''],
  //     zip: [''],
  //     state: [''],
  //     role: [''],
  //   },


  // );

    this.getAllUsers();
  }


  postUserDetails() {
    // this.userModelObj.id = this.currentId;
    // this.currentId++;
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.firstname = this.formValue.value.firstname;
    this.userModelObj.lastname = this.formValue.value.lastname;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.street = this.formValue.value.street;
    this.userModelObj.zip = this.formValue.value.zip;
    this.userModelObj.state = this.formValue.value.state;
    this.userModelObj.username = this.makeUserName();
    this.userModelObj.password = this.formValue.value.password;

    this.api.postUser(this.userModelObj).subscribe(res => {
      console.log(res);
      alert("User has been successfully added!")
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();
      this.router.navigate(['login']);

    }, err => {
      alert("Error Try Again!")
    }
    )



  }

  makeUserName(): string {
    return this.formValue.value.firstname.charAt(0) + this.formValue.value.lastname;
  }

  makePass(): string {
    return this.formValue.value.firstname.charAt(0) + this.formValue.value.lastname + "123";
  }

  getAllUsers() {
    this.api.getUser().subscribe(res => {
      this.userData = res;
    })
  }



}



// Creates User Object
