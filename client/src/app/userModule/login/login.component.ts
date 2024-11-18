import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../shared/userService/data-access/user.service';
import { PasswordExpirationService } from '../../shared/services/passwordExpirationService/password-expiration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userService = inject(UserService);
  formValue !: FormGroup;
  passwordHide: boolean = true;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private auth: Auth,
    private passwordExpirationService: PasswordExpirationService
  ) {
    this.formValue = this.formbuilder.group({
      username: [''],
      password: ['']
    });
  }

  async login() {
    try {
      // First perform the regular login
      await this.userService.login(
        this.formValue.value.username,
        this.formValue.value.password
      );

      // Get the current user's ID after successful login
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Login failed - no user found');
      }

      // Check password expiration
      const isPasswordValid = await this.passwordExpirationService.checkPasswordExpiration(currentUser.uid);

      if (isPasswordValid) {
        // If password is valid, proceed with navigation
        this.router.navigate(['']);
      } else {
        // If password is expired, redirect to password change page
        // Note: You'll need to create this route and component
        this.router.navigate(['/change-password']);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // You might want to show an error message to the user here
    }
  }
}
