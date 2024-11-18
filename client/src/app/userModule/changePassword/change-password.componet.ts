import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, updatePassword } from '@angular/fire/auth';
import { UserService } from '../../shared/userService/data-access/user.service';
import { PasswordExpirationService } from '../../shared/services/passwordExpirationService/password-expiration.service';
import { MessagingService } from '../../shared/messagingService/messaging-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: Auth,
    private userService: UserService,
    private passwordExpirationService: PasswordExpirationService,
    private messagingService: MessagingService
  ) {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.passwordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const user = this.auth.currentUser;
        if (!user) {
          throw new Error('No user logged in');
        }

        // Update password in Firebase Auth
        await updatePassword(user, this.passwordForm.value.newPassword);

        // Update password last changed timestamp
        await this.passwordExpirationService.updatePasswordLastChanged(user.uid);

        // Send success notification
        await this.messagingService.sendSystemNotification(user.uid, {
          title: 'Password Updated',
          message: 'Your password has been successfully changed.',
          type: 'success',
          timestamp: new Date(),
          read: false,
          recipientUid: user.uid,
          id: ''
        });

        // Navigate back to home
        this.router.navigate(['']);
      } catch (error) {
        console.error('Error changing password:', error);

        // Send error notification
        const user = this.auth.currentUser;
        if (user) {
          await this.messagingService.sendSystemNotification(user.uid, {
            title: 'Password Change Failed',
            message: 'There was an error changing your password. Please try again.',
            type: 'error',
            timestamp: new Date(),
            read: false,
            recipientUid: user.uid,
            id: ''
          });
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
