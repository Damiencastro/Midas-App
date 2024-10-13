import { Component, OnInit, inject } from '@angular/core';
import { UserModel } from '../account/account.model';
import { ApiService } from '../../shared/api.service';
import { Router, RouterModule, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  formValue !: FormGroup;
  userModelObj : UserModel = new UserModel();
  userData !: any;
  passwordHide: boolean = true;
  private userKey = 'userKey';

  constructor(private formbuilder: FormBuilder, private api : ApiService, private router: Router, private http: HttpClient){}

  login() {
        this.api.login(this.formValue.value.username, this.formValue.value.password);
  }


  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      username:[''],
      password:[''],

    })

  }
}
