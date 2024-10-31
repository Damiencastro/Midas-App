import { Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged, Subject, switchMap, of, filter, takeUntil } from "rxjs";
import { UserModel } from "../dataModels/userProfileModel/user.model";
import { AuthStateService } from "./auth-state.service";
import { UserFirestoreService } from "../services/firestoreService/user-firestore.service";

interface UserProfileState {
    profile: UserModel | null;
  }
  
  @Injectable({ providedIn: 'root' })
  export class UserProfileStateService {
    private readonly profileStateSubject = new Subject<UserProfileState>();

    private readonly destroy$ = new Subject<void>();

    constructor(
        authStateService: AuthStateService,
        firestoreService: UserFirestoreService
    ) {
        this.initProfileState(authStateService, firestoreService);
    }
  
    initProfileState(authStateService: AuthStateService, firestoreService: UserFirestoreService) {
        this.destroy$.next();
    
        authStateService.isLoggedIn$.pipe(
            switchMap(isLoggedIn => {
                if (!isLoggedIn) {
                    return of({ profile: null });
                }
                return authStateService.getUid$.pipe(
                    // Explicitly handle undefined/null case
                    filter((uid): uid is string => uid !== null && uid !== undefined),
                    switchMap(uid => 
                        firestoreService.getUserObservable(uid).pipe(
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
  }