import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';

// Define event types - we can expand this as needed
export enum EventType {
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  ACCOUNT_UPDATED = 'ACCOUNT_UPDATED',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',
  JOURNAL_ENTRY_CREATED = 'JOURNAL_ENTRY_CREATED',
  JOURNAL_ENTRY_APPROVED = 'JOURNAL_ENTRY_APPROVED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT'
  // Add more event types as needed
}

// Define the event structure
export interface AppEvent<T = any> {
  type: EventType;
  payload: T;
  timestamp?: Date;
  source?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<AppEvent>();

  /**
   * Emit an event to all subscribers
   */
  emit<T>(event: Omit<AppEvent<T>, 'timestamp'>): void {
    const fullEvent: AppEvent<T> = {
      ...event,
      timestamp: new Date()
    };
    this.eventSubject.next(fullEvent);
  }

  /**
   * Subscribe to all events of a specific type
   */
  on<T>(eventType: EventType): Observable<AppEvent<T>> {
    return this.eventSubject.pipe(
      filter(event => event.type === eventType)
    );
  }

  /**
   * Subscribe to multiple event types
   */
  onMany(eventTypes: EventType[]): Observable<AppEvent> {
    return this.eventSubject.pipe(
      filter(event => eventTypes.includes(event.type))
    );
  }

  /**
   * Get all events (useful for logging/debugging)
   */
  all(): Observable<AppEvent> {
    return this.eventSubject.asObservable();
  }
}