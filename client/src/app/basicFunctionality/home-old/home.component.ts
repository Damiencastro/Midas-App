import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login-old/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  public userDetail: UserModel = new UserModel();
  public reset: UserModel = new UserModel();


  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('user') != null) {
        const temp = localStorage.getItem('user');
        if (temp != null) {
          this.userDetail = JSON.parse(temp);
        }
      }
    }
  }

  isLoggedIn = (): boolean => {

    if (typeof window !== 'undefined') {
      if (localStorage.getItem('user') != null) {
        const temp = localStorage.getItem('user');
        if (temp != null) {
          this.userDetail = JSON.parse(temp);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }

  }


  getRole(): number {
    return this.api.getRole();
  }
}
