import { Injectable } from "@angular/core";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { Notification } from "../../states/notification-state.service";
import { EventLog } from "../event-log.service";
import { doc, Firestore, onSnapshot, collection, QuerySnapshot } from "@angular/fire/firestore";

@Injectable({ providedIn: 'root' })
export class FirestoreLogService {
  private readonly logSubject = new BehaviorSubject<EventLog[]>([]);

  constructor(private firestore: Firestore) {
    onSnapshot(collection(firestore, 'logs'), (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        ...doc.data()
      }) as EventLog);
      this.logSubject.next(logs);
    });
  }

    logEvent(eventLog: EventLog) {
        // Log the event
        const logDocRef = doc(this.firestore, 'logs', eventLog.id);
        
    }
  readonly notifications$ = this.logSubject.asObservable();
}