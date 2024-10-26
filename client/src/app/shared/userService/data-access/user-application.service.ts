import { Injectable, inject } from "@angular/core";
import { UserService } from "./user.service";
import { BehaviorSubject } from "rxjs";
import { CollectionReference, DocumentReference, collection } from "@angular/fire/firestore";
import { Firestore } from "@angular/fire/firestore";


@Injectable({
    providedIn: 'root'
})
export class UserApplicationService {
    private userServiceSubject = new BehaviorSubject<UserService | null>(null);
    private userServiceLoadingSubject = new BehaviorSubject<boolean>(false);
    private userServiceErrorSubject = new BehaviorSubject<any | null>(null);

    private readonly userService$ = this.userServiceSubject.asObservable();
    private readonly userServiceLoading$ = this.userServiceLoadingSubject.asObservable();
    private readonly userServiceError$ = this.userServiceErrorSubject.asObservable();
    
    private applicationCollectionSubject = new BehaviorSubject<CollectionReference | null>(null);
    private applicationErrorSubject = new BehaviorSubject<any | null>(null);
    private applicationLoadingSubject = new BehaviorSubject<boolean>(false);

    private readonly applicationCollections = this.applicationCollectionSubject.asObservable();
    private readonly applicationLoading$ = this.applicationLoadingSubject.asObservable();
    private readonly applicationError$ = this.applicationErrorSubject.asObservable();

    constructor(userService: UserService, firestore: Firestore) {
        this.initializeApplicationService(userService, firestore);
    }
    
    
    initializeApplicationService(userService: UserService, firestore: Firestore) {
        try{
            this.userServiceLoadingSubject.next(true);
            this.userServiceErrorSubject.next(null);
            if(userService){
                this.userServiceSubject.next(userService);
                this.userServiceLoadingSubject.next(false);
            } else{
                this.userServiceErrorSubject.next('User service not found');
            }

            this.firestoreLoadingSubject.next(true);
            this.firestoreErrorSubject.next(null);

            if(firestore){
                
                this.firestoreSubject.next(firestore);

            }else{
                this.firestoreErrorSubject.next('Firestore not found');
            }


        }catch (error) {
            this.userServiceErrorSubject.next(error);
            this.applicationErrorSubject.next(error);
        }

    }


    getApplications(): CollectionReference{
        return this.application
    }

    //Approve Application

    //Reject Application - Reason why

    //
        
}