import { Component, OnInit, inject } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { error } from 'console';
import { UserService } from '../../services/UserService/user.service';
import { Auth, getAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';


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
  currentId: string = '';
  
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly error$ = this.errorSubject.asObservable();



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
    
    this.errorSubject.next(null);
    
    this.userService.application({
      id: this.currentId,
      username: this.makeUserName(),
      firstname: this.formValue.value.firstname,
      lastname: this.formValue.value.lastname,
      phone: this.formValue.value.phone,
      street: this.formValue.value.street,
      zip: this.formValue.value.zip,
      state: this.formValue.value.state,
      password: this.formValue.value.password,
      role: this.formValue.value.role,
    }).then(() => {
      console.log('User created successfully');
    }).catch((error) => {
      this.errorSubject.next(this.getErrorMessage(error));
    })

    
  }

  private getErrorMessage(error: any): string {
    if (error?.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'This email is already registered';
        case 'auth/invalid-email':
          return 'Invalid email address';
        case 'auth/operation-not-allowed':
          return 'Registration is currently disabled';
        case 'auth/weak-password':
          return 'Password is too weak';
        default:
          return 'An unexpected error occurred';
      }
    }
    return error?.message || 'An unexpected error occurred';
  }

  makeUserName(): string {
    return this.formValue.value.firstname.charAt(0) + this.formValue.value.lastname;
  }

}



// Creates User Object
