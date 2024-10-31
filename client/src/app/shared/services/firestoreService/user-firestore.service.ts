import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc, onSnapshot, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { User as FirebaseUser, user } from '@angular/fire/auth'
import { DocumentData, DocumentReference, QuerySnapshot, collection } from 'firebase/firestore';
import { BehaviorSubject, Observable, distinctUntilChanged, firstValueFrom, map, of, switchMap, takeUntil, tap, catchError } from 'rxjs';

import { UserModel } from '../../dataModels/userProfileModel/user.model';
import { UserDisplayUtils } from '../../userService/utils/user-display.utils';
import { AuthStateService } from '../../states/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserFirestoreService implements OnDestroy{

  private userCollectionLoadingSubject = new BehaviorSubject<boolean>(false);              
  private userCollectionErrorSubject = new BehaviorSubject<any | null>(null);
  private userCollectionSnapshotSubject = new BehaviorSubject<QuerySnapshot | null>(null);

  userCollectionSnapshot$ = this.userCollectionSnapshotSubject.asObservable();

  private readonly destroySubject = new BehaviorSubject<void>(undefined);

  
  constructor(private firestore: Firestore, private authStateService: AuthStateService) {
    this.initializeUserFirestoreService();
   }


   initializeUserFirestoreService(){
    console.log('UserFirestoreService initializing...');
    this.authStateService.isLoggedIn$.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(isLoggedIn => {
      if(isLoggedIn){
        // Unsubscribe from previous snapshots when user logs in again
        this.destroySubject.next(); 

        onSnapshot(collection(this.firestore, 'users'), 
          (snapshot) => this.userCollectionSnapshotSubject.next(snapshot), 
          (error) => this.userCollectionErrorSubject.next(error) 
        );
      } 
    });
   }
  

  // Get user from uid
  getUserObservable(uid: string): Observable<UserModel | null> {
    return this.authStateService.isLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return of(null); 
        }
        const userDocRef = doc(this.firestore, 'users', uid);
        return new Observable<UserModel | null>(observer => { 
          const unsubscribe = onSnapshot(userDocRef, 
            (docSnapshot: DocumentSnapshot<DocumentData>) => {
              if (docSnapshot.exists()) {
                observer.next(docSnapshot.data() as UserModel);
              } else {
                observer.next(null);
              }
            },
            (error) => observer.error(error)
          );
          // Return the unsubscribe function to be called when the Observable is unsubscribed
          return unsubscribe; 
        });
      })
    );
  }


  getAllUsers(): Observable<UserModel[]> {
    return this.userCollectionSnapshot$.pipe(
      map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
        return snapshot ? snapshot.docs.map(doc => doc.data() as UserModel) : [];
      })
    );
  }

  async getUser(uid: string): Promise<UserModel | null> {
    return firstValueFrom(this.getUserObservable(uid));
  }

  async getAllUsersOnce(): Promise<UserModel[]> {
    const usersRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as UserModel);
  }
  
  
  // get all users with optional filter (consider adding type safety here)
  getAllUsersWhere(
    property: keyof UserModel,
    operator: '==' | '<' | '<=' | '>' | '>=',
    value: any
  ): Observable<UserModel[]> {
    return this.userCollectionSnapshot$.pipe(
      map((snapshot) => {
        if (!snapshot) return [];
        return snapshot.docs
          .map(doc => doc.data() as UserModel)
          .filter(user => {
            // Add type checking and null/undefined checks for propertyValue
            // ...
          });
      })
    );
  }


  

  ngOnDestroy(): void {
    this.userCollectionLoadingSubject.complete();
    this.userCollectionErrorSubject.complete();

    this.userCollectionSnapshotSubject.complete();
    this.destroySubject.next(); 
    this.destroySubject.complete();
  }
}