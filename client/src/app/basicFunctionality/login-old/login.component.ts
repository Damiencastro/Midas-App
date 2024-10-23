import { Component, OnInit, inject } from '@angular/core';
import { UserModel } from '../account-old/account.model';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth'; //While it says email, we are going to just have the user provide the username.
                                                                       //and then we can just append '@midas.com' to the username to make it an email.

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  formValue !: FormGroup;
  private auth = inject(Auth);
  userData !: any;
  passwordHide: boolean = true;
  private userKey = 'userKey';

  constructor(private formbuilder: FormBuilder, private api : ApiService, private router: Router, private http: HttpClient){}

  login() {
    signInWithEmailAndPassword(this.auth, this.formValue.value.username + '@midas.com', this.formValue.value.password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          console.error(error);
        })
        //this.api.login(this.formValue.value.username, this.formValue.value.password);

  }


  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      username:[''],
      password:[''],

    })

  }
}
