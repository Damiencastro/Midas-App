import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  user = inject(UserService);
  formValue !: FormGroup;
  userData !: any;
  passwordHide: boolean = true;
  private userKey = 'userKey';

  constructor(private formbuilder: FormBuilder, private api : ApiService, private router: Router, private http: HttpClient, private auth: Auth){}

  login() {
        this.user.login(this.auth, this.formValue.value.username, this.formValue.value.password);
        //this.api.login(this.formValue.value.username, this.formValue.value.password);

  }


  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      username:[''],
      password:[''],

    })

  }
}
