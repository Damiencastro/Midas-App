import { Injectable, inject } from "@angular/core";
import { Firestore, doc, onSnapshot } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { EventLog } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { AccountFirestoreService } from "../../../shared/firestoreService/accountStore/data-access/account-firestore.service";


@Injectable({
    providedIn: "root"
})
export class AccountEventService{
    private firestore = inject(Firestore);
    accountFirestoreService = inject(AccountFirestoreService);

    private accountEventSubject = new BehaviorSubject<EventLog[]>([]);
    accountEvents$ = this.accountEventSubject.asObservable();

    constructor(){
        this.initializeAccountEventSubscription();
    }
    
    initializeAccountEventSubscription(){
         
    }

}