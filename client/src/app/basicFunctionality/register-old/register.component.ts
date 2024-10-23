import { Component, OnInit, inject } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
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


  constructor(private formbuilder: FormBuilder, private api: ApiService, private router: Router, private auth: Auth) {
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

  // ngOnInit(): void {

  // //   this.formValue = this.formbuilder.group({
  // //     username: [''],
  // //     password: ['', [Validators.required, Validators.minLength(8)]],
  // //     confirmPassword: [''],
  // //     firstname: ['', [Validators.required]],
  // //     lastname: ['', [Validators.required]],
  // //     email: ['', [Validators.required], Validators.email,],
  // //     phone: [''],
  // //     street: [''],
  // //     zip: [''],
  // //     state: [''],
  // //     role: [''],
  // //   },


  // // );

  //   this.getAllUsers();
  // }


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
    


    // Now that we have the details, we need to send that to the user

    // this.api.postUser(this.userService.user).subscribe(res => {
    //   console.log(res);
    //   alert("User has been successfully added!")
    //   let ref = document.getElementById('cancel');
    //   ref?.click();
    //   this.formValue.reset();
    //   this.getAllUsers();
    //   this.router.navigate(['login']);

    // }, err => {
    //   alert("Error Try Again!")
    // }
    // )



  }

  makeUserName(): string {
    return this.formValue.value.firstname.charAt(0) + this.formValue.value.lastname;
  }

  makePass(): string {
    return this.formValue.value.firstname.charAt(0) + this.formValue.value.lastname + "123";
  }

  // getAllUsers() {
  //   this.api.getUser().subscribe(res => {
  //     this.userData = res;
  //   })
  // }



}



// Creates User Object
