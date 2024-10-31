import { Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged, Subject, switchMap, of, filter, takeUntil } from "rxjs";
import { UserApplication, UserApplicationWithMetaData, UserModel } from "../dataModels/userProfileModel/user.model";
import { AuthStateService } from "./auth-state.service";
import { UserFirestoreService } from "../services/firestoreService/user-firestore.service";
import { FirebaseApp } from "@angular/fire/app";
import { serverTimestamp } from "firebase/firestore";

interface UserProfileState {
    profile: UserModel | null;
  }
  
  @Injectable({ providedIn: 'root' })
  export class UserProfileStateService {
    private readonly profileStateSubject = new Subject<UserProfileState>();

    private readonly destroy$ = new Subject<void>();

    constructor(
        private authStateService: AuthStateService,
        private firestoreService: UserFirestoreService
    ) {
        this.initProfileState();
    }
  
    initProfileState() {
        this.destroy$.next();
    
        this.authStateService.isLoggedIn$.pipe(
            switchMap(isLoggedIn => {
                if (!isLoggedIn) {
                    return of({ profile: null });
                }
                return this.authStateService.getUid$.pipe(
                    // Explicitly handle undefined/null case
                    filter((uid): uid is string => uid !== null && uid !== undefined),
                    switchMap(uid => 
                        this.firestoreService.getUserObservable(uid).pipe(
                            map(profile => ({ profile }))
                        )
                    )
                );
            }),
            takeUntil(this.destroy$)
        ).subscribe(state => {
            this.profileStateSubject.next(state);
        });
    }
    
    // Don't forget to add in your class:
    
    readonly activeRole$ = this.profileStateSubject.pipe(
      map(state => state.profile?.role),
      distinctUntilChanged()
    );
  
    readonly activeProfile$ = this.profileStateSubject.pipe(
      map(state => state.profile),
      distinctUntilChanged()
    );


    submitApplication(userApp: UserApplicationWithMetaData): Promise<void> {
        const userApplicationWithMetadata = {
            ...userApp,
            submittedOn: serverTimestamp(),
            status: 'PENDING',
            reviewedBy: null,
            
        }
        return this.firestoreService.submitApplication(userApplicationWithMetadata);
    }
  }