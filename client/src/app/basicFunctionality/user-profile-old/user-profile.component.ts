import { Component, inject, OnInit } from '@angular/core';
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
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent   implements OnInit {

  public profileDetail: UserModel = new UserModel();
  public reset: UserModel = new UserModel();
  public routerLink: RouterLink = inject(RouterLink);

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('profile') != null) {
        const temp = localStorage.getItem('profile');
        if (temp != null) {
          this.profileDetail = JSON.parse(temp);
        }
      }
    }
  }


}

