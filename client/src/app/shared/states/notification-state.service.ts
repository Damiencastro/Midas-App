import { Injectable } from "@angular/core";
import { type } from "os";
import { BehaviorSubject, map, distinctUntilChanged, combineLatest, shareReplay, Subject } from "rxjs";
import { NotificationService } from "../services/firestoreService/notification-firestore.service";

export interface NotificationFilter {
    type: 'EMAIL' | 'ALERT' | 'SYSTEM';
    priority: 'all' | 'low' | 'medium' | 'high';
    category: 'all' | 'system' | 'approval' | 'alert';
}

export interface Notification{
    id: string;
    type: 'EMAIL' | 'ALERT' | 'SYSTEM';
    priority:  'low' | 'medium' | 'high';
    category: 'all' | 'system' | 'approval' | 'alert';
    read: boolean;
    sentAt: Date;
    recipient: string;
    successful: boolean;
}

interface NotificationState {
    notifications: Notification[];
    notificationFilters: NotificationFilter;
  }
  
  @Injectable({ providedIn: 'root' })
  export class NotificationStateService {
    private readonly notificationStateSubject = new Subject<NotificationState>();

    constructor(notificationService: NotificationService) {
        this.initNotificationStoreSubscription(notificationService);
    }

    private initNotificationStoreSubscription(notificationService: NotificationService) {
        notificationService.notifications$.subscribe(notifications => {
            
        })
    }
  
    readonly unreadCount$ = this.notificationStateSubject.pipe(
      map(state => state.notifications.length),
      distinctUntilChanged()
    );

    readonly filteredNotifications$ = this.notificationStateSubject.pipe(
        map(state => ({ 
          notifications: state.notifications, // Assuming you have a notifications array in your state
          filters: state.notificationFilters 
        })),
        map(({ notifications, filters }) => this.applyFilters(notifications, filters)),
        distinctUntilChanged(),
        shareReplay(1)
      );

    applyFilters(notifications: Notification[], filters: NotificationFilter): Notification[] {
        return notifications.filter(notification => {
          const typeMatch = notification.type === filters.type;
          const priorityMatch = notification.priority === filters.priority;
          const categoryMatch = filters.category === 'all' || notification.category === filters.category;
          return typeMatch && priorityMatch && categoryMatch;
        });
    }
  }

  