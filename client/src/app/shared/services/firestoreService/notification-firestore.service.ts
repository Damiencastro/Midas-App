import { Injectable } from "@angular/core";
import { Firestore, collection } from "@angular/fire/firestore";
import { DocumentData, QuerySnapshot, onSnapshot } from "firebase/firestore";
import { Notification } from "../../states/notification-state.service";
import { Subject } from "rxjs";
import { UserProfileStateService } from "../../states/user-profile-state.service";



@Injectable({ providedIn: 'root' })
export class NotificationService {

    snapshotSubject = new Subject<QuerySnapshot<DocumentData, DocumentData>>();
    

    constructor(firestore: Firestore, profileState: UserProfileStateService) {
    this.initNotificationListener(firestore, profileState);
    }
    
    initNotificationListener(firestore: Firestore, profileState: UserProfileStateService) {
        profileState.activeProfile$.subscribe(profile =>{
            if (profile) {
                const filter = profile.notificationFilter ? profile.notificationFilter : null;
                onSnapshot(collection(firestore, 'notifications' ), (snapshot) => {
                    this.snapshotSubject.next(snapshot);
                });
            }
        })
        
    }
}