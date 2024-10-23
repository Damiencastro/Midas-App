import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login-old/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  userService = inject(UserService);
  constructor(private router: Router, private auth: Auth) { }


  isLoggedIn = (): boolean => {

    return this.userService.isLoggedIn(this.auth);

  }

  logout = () => {
    this.userService.logout(this.auth);

    this.router.navigate(['/login']);
  };

  getRole(): number {
    return this.userService.getRole(this.auth);
  }
}
