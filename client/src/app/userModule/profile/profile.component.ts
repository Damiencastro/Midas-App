import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserModel } from '../../shared/dataModels/userProfileModel/user.model';
import { UserService } from '../../shared/userService/data-access/user.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  public userService = inject(UserService);

  public userRole$ = this.userService.viewRole$;
  public userPhone$ = this.userService.viewPhone$;
  public userName$ = this.userService.username$;

  constructor(private router: Router, private auth: Auth) { }

  public refreshUser() {
    console.log(this.userService.userProfile$);
  }


}

