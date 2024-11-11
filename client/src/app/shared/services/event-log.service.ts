import { Injectable } from "@angular/core";
import { EventType } from "./event-bus.service"
import { FirestoreLogService } from "./firestoreService/log-firestore.service";

export interface EventLog {
    type: EventType
    id: string;
    userId: string;
    timestamp: Date;
    details: any;
}
@Injectable({
    providedIn: 'root'
})
export class EventLogService {
    constructor(
        private firestoreLogService: FirestoreLogService
    ) { }

    logEvent(eventLog: EventLog) {
        // Log the event
        this.firestoreLogService.logEvent(eventLog);
        console.log(`Event logged: ${eventLog.type}`);

    }

    logAccountAccess(accountId: string, userId: string) {
        const eventLog: EventLog = {
            type: EventType.ACCOUNT_ACCESS,
            id: accountId,
            userId: userId,
            timestamp: new Date(),
            details: {}
        }
        this.logEvent(eventLog);
    }
}