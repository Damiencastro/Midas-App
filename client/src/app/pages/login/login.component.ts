import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  hide = true;
  form!: FormGroup;
  fb = inject(FormBuilder);
  loggedIn: boolean = false;
  SignInVisible: boolean = true;

  login() {
    return true;
  }

  ngOnInit(): void {

  }
}
