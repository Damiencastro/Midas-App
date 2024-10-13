import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../../pages/login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/api.service';
import { UserModel } from '../../pages/account/account.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent  implements OnInit {

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

  logout = () => {
    if (localStorage.getItem('user') != null) {
      localStorage.removeItem('user');
    }
    this.userDetail = this.reset;

    this.router.navigate(['/login']);
  };

  getRole(): number {
    return this.api.getRole();
  }
}
