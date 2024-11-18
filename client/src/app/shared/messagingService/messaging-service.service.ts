import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Message, UserMessage, Notification } from '../dataModels/messageModel/message.model';
import { Firestore, addDoc, collection, getDocs, query, where, orderBy } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private readonly firestore = inject(Firestore);
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);

  readonly notifications$ = this.notificationsSubject.asObservable();

  constructor() { }

  sendMessage(message: Message) {
    const messageCollection = collection(this.firestore, 'messages' + message.recipientUid);
    return addDoc(messageCollection, message);
  }

  async getMessages(uid: string): Promise<Message[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'messages' + uid));
    let messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data() as Message);
    });
    return messages;
  }

  // New methods for system notifications
  async sendSystemNotification(recipientUid: string, notification: Partial<Notification>) {
    const newNotification: Notification = {
      message: notification.message || '',
      title: notification.title || 'System Notification',
      type: notification.type || 'info',
      timestamp: new Date(),
      read: false,
      recipientUid,
      id: '' // Will be set by Firestore
    };

    try {
      // Store in a separate notifications collection
      const notificationsRef = collection(this.firestore, 'notifications');
      const docRef = await addDoc(notificationsRef, newNotification);

      // Update the notification with its Firestore ID
      newNotification.id = docRef.id;

      // Update local notifications state
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([...currentNotifications, newNotification]);

      return newNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async getUserNotifications(uid: string): Promise<Notification[]> {
    try {
      const notificationsRef = collection(this.firestore, 'notifications');
      const q = query(
        notificationsRef,
        where('recipientUid', '==', uid),
        where('read', '==', false),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];

      querySnapshot.forEach((doc) => {
        notifications.push({ ...doc.data(), id: doc.id } as Notification);
      });

      this.notificationsSubject.next(notifications);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
}
