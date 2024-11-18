import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { UserService } from '../../userService/data-access/user.service';
import { MessagingService } from '../messagingService/messaging-service.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordExpirationService {
  private readonly EXPIRATION_DAYS = 90; // Password expires after 90 days
  private readonly WARNING_DAYS = 3; // Warn user 3 days before expiration

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private messagingService: MessagingService
  ) { }

  async checkPasswordExpiration(userId: string): Promise<boolean> {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      const userData = userDoc.data();
      const passwordLastChanged = userData.passwordLastChanged?.toDate() || new Date();
      const today = new Date();

      // Calculate days until expiration
      const daysUntilExpiration = Math.ceil(
        (passwordLastChanged.getTime() + (this.EXPIRATION_DAYS * 24 * 60 * 60 * 1000) - today.getTime())
        / (1000 * 60 * 60 * 24)
      );

      // If password is expired
      if (daysUntilExpiration <= 0) {
        await this.messagingService.sendSystemNotification(userId, {
          title: 'Password Expired',
          message: 'Your password has expired. Please change it immediately.',
          type: 'error',
          timestamp: new Date(),
          read: false,
          recipientUid: userId,
          id: ''
        });
        return false;
      }

      // If password is about to expire
      if (daysUntilExpiration <= this.WARNING_DAYS) {
        await this.messagingService.sendSystemNotification(userId, {
          title: 'Password Expiring Soon',
          message: `Your password will expire in ${daysUntilExpiration} day${daysUntilExpiration > 1 ? 's' : ''}. Please change it soon.`,
          type: 'warning',
          timestamp: new Date(),
          read: false,
          recipientUid: userId,
          id: ''
        });
      }

      return true;
    } catch (error) {
      console.error('Error checking password expiration:', error);
      throw error;
    }
  }

  async updatePasswordLastChanged(userId: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      await updateDoc(userRef, {
        passwordLastChanged: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating password last changed date:', error);
      throw error;
    }
  }
}
