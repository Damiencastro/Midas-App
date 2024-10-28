import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc, onSnapshot} from '@angular/fire/firestore';
import { User as FirebaseUser, user } from '@angular/fire/auth'
import { DocumentData, DocumentReference, QuerySnapshot, collection } from 'firebase/firestore';
import { BehaviorSubject, Observable, firstValueFrom, map, of, switchMap, takeUntil, tap } from 'rxjs';

import { UserModel } from '../../../dataModels/userProfileModel/user.model';
import { UserDisplayUtils } from '../../../userService/utils/user-display.utils';

@Injectable({
  providedIn: 'root'
})
export class UserFirestoreService implements OnDestroy{

  userCollectionSnapshotSubject = new BehaviorSubject<QuerySnapshot | null>(null); //This holds a snapshot of type: QuerySnapshot<DocumentData, DocumentData>.
  // Key properties of QuerySnapshot
  // snapshot.docs         // Array of QueryDocumentSnapshot objects
  // snapshot.empty       // boolean - true if no documents exist
  // snapshot.size        // number - count of documents
  // snapshot.metadata    // SnapshotMetadata object containing hasPendingWrites and fromCache

  // Common methods
  // snapshot.docChanges() // Returns array of DocumentChange objects
  // snapshot.forEach()    // Allows you to iterate over the documents
  userCollectionLoadingSubject = new BehaviorSubject<boolean>(false);              //
  userCollectionErrorSubject = new BehaviorSubject<any | null>(null);

  userCollectionSnapshot$ = this.userCollectionSnapshotSubject.asObservable();
  userCollectionLoading$ = this.userCollectionLoadingSubject.asObservable();
  userCollectionError$ = this.userCollectionErrorSubject.asObservable();

  private firestore = inject(Firestore);

  private readonly destroySubject = new BehaviorSubject<void>(undefined);


  constructor(firestore: Firestore) {
    this.initializeUserFirestoreService(firestore);
   }


   initializeUserFirestoreService(firestore: Firestore){
    console.log('UserFirestoreService initializing...');
    onSnapshot(collection(firestore, 'users'), (snapshot) => {
      this.userCollectionSnapshotSubject.next(snapshot);
      of(snapshot).pipe(
        takeUntil(this.destroySubject),
        tap(() => this.userCollectionLoadingSubject.next(true)),
        map(( snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
          this.userCollectionSnapshotSubject.next(snapshot);
          console.log(snapshot);
          this.userCollectionLoadingSubject.next(false);
        })
      );
    });
      
   }

   refreshSnapshot(){
    
  }
  

  // Get user from uid
  getUserObservable(uid: string): Observable<UserModel | null> {
    return this.userCollectionSnapshot$.pipe(
      // First map to handle possible null values
      map((snapshot) => {
        if (snapshot === null) {
          try{
            this.refreshSnapshot();
            if(this.userCollectionSnapshotSubject.value === null){
              throw new Error('Snapshot is still null');
            }
          }catch(e){
            console.log(e);
            console.log('No snapshot');
            return null;
          }
          
        }
        if(snapshot === null) {return null;}
        // Find the matching document
        const userDoc = snapshot.docs.find(doc => doc.id === uid);
        return userDoc ? userDoc.data() as UserModel : null;
      })
    );
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.userCollectionSnapshot$.pipe(
      map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
        // Handle null case
        if (!snapshot) return [];
        
        // Convert each document to a UserModel
        return snapshot.docs.map(doc => ( doc.data() as UserModel
        ));
      })
    );
  }

  async getUser(uid: string): Promise<UserModel | null> {
    return firstValueFrom(this.getUserObservable(uid));
  }

  async getAllUsersOnce(): Promise<UserModel[]> {
    return firstValueFrom(this.getAllUsers());
  }
  
  
  // get all users with optional filter
  getAllUsersWhere(
    property: keyof UserModel,
    operator: '==' | '<' | '<=' | '>' | '>=',
    value: any
  ): Observable<UserModel[]> {
    return this.userCollectionSnapshot$.pipe(
      map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
        if (!snapshot) return [];

        return snapshot.docs
          .map(doc => (
            doc.data() as UserModel
          ))
          .filter(user => {
            if(!user[property]) return false;
            const propertyValue = user[property];
            if(propertyValue === undefined || propertyValue === null) return false;

            switch (operator) {
              case '==': return propertyValue === value;
              case '<': return propertyValue < value;
              case '<=': return propertyValue <= value;
              case '>': return propertyValue > value;
              case '>=': return propertyValue >= value;
              default: return false;
            }
          });
        })
    )
  }

  // create userProfile and associate with user auth info
  linkUserProfileToAuth(uid: string, user: UserModel) {
    
    if(this.firestore){
      setDoc(doc(this.firestore, 'users', uid), user);
    } else {
      throw new Error('Firestore is not available');
    }
    
  }

  createUsername(userProfile: UserModel){
    console.log(userProfile)
    const candidateUsername = UserDisplayUtils.formatUsername(userProfile);
    this.checkUsername(candidateUsername).then((isAvailable) => {
      if(isAvailable){
        userProfile.username = candidateUsername;
      } else {
        userProfile.username = candidateUsername + Math.random();
        return 
      }
    });
    console.log(userProfile);
    return userProfile.username;
  }

  checkUsername(candidateUsername: string): Promise<boolean> {
    return firstValueFrom(this.getAllUsersWhere('username', '==', candidateUsername)).then(users => {
      return users.length === 0;
    });
  }


  ngOnDestroy(): void {
    this.userCollectionLoadingSubject.complete();
    this.userCollectionErrorSubject.complete();

    this.userCollectionSnapshotSubject.complete();
    this.destroySubject.complete();

  }
}
