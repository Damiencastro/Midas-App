import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc} from '@angular/fire/firestore';
import { DocumentReference, collection } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

import { UserFilter } from '../../../dataModels/userProfileModel/user-filter.model';
import { UserModel } from '../../../dataModels/userProfileModel/user.model';
import { UserApplicationModel } from '../../../dataModels/userProfileModel/user-application.model';

@Injectable({
  providedIn: 'root'
})
export class UserFirestoreService implements OnDestroy{

  userCollectionSubject = new BehaviorSubject<CollectionReference | null>(null);
  userCollectionLoadingSubject = new BehaviorSubject<boolean>(false);
  userCollectionErrorSubject = new BehaviorSubject<any | null>(null);

  userCollection$ = this.userCollectionSubject.asObservable();
  userCollectionLoading$ = this.userCollectionLoadingSubject.asObservable();
  userCollectionError$ = this.userCollectionErrorSubject.asObservable();

  userApplicationCollectionSubject = new BehaviorSubject<CollectionReference | null>(null);
  userApplicationCollectionLoadingSubject = new BehaviorSubject<boolean>(false);
  userApplicationCollectionErrorSubject = new BehaviorSubject<any | null>(null);

  userApplicationCollection$ = this.userApplicationCollectionSubject.asObservable();
  userApplicationCollectionLoading$ = this.userApplicationCollectionLoadingSubject.asObservable();
  userApplicationCollectionError$ = this.userApplicationCollectionErrorSubject.asObservable();

  firestoreSubject = new BehaviorSubject<Firestore | null>(null);
  firestore$ = this.firestoreSubject.asObservable();


  constructor(firestore: Firestore) {

    if(firestore) {
      this.firestoreSubject.next(firestore);
    } else{
      throw new Error('Firestore is not available');
    }

    //First, we indicate that the user collection is loading and there are no errors yet
    this.userCollectionLoadingSubject.next(true);
    this.userCollectionErrorSubject.next(null);
    try { // Then we try to load it up
      this.userCollectionSubject.next(collection(firestore, 'users'));
      this.userCollectionLoadingSubject.next(false);
    } catch(error) { //If there's an error, we set the error and stop loading
      this.userCollectionErrorSubject.next(error);
      this.userCollectionLoadingSubject.next(false);
    }

    //Same for the user application collection
    this.userApplicationCollectionLoadingSubject.next(true);
    this.userApplicationCollectionErrorSubject.next(null);
    try {
      this.userApplicationCollectionSubject.next(collection(firestore, 'applications'));
      this.userApplicationCollectionLoadingSubject.next(false);
    } catch(error) {
      this.userApplicationCollectionErrorSubject.next(error);
      this.userApplicationCollectionLoadingSubject.next(false);
    }

   }

  

  // Get user from uid
   getUserDocRefByUid(uid: string): DocumentReference | null{
    this.firestore$.subscribe(firestore => {
      if(firestore){
        return doc(firestore, 'users', uid);
      } else {
        throw new Error('Firestore is not available');
      }
    });
    return null;
   }
  // get user from username
   getUserDocRefByUsername(username: string): DocumentReference | null{
    this.firestore$.subscribe(firestore => {
      if(firestore){
        return doc(firestore, 'users', username);
      } else {
        throw new Error('Firestore is not available');
      }
    });
    return null;
   }

  // get all users with optional filter
  getUsersCollection(filter?: UserFilter): CollectionReference | null{
    this.userCollection$.subscribe(collection => {
      if(collection){
        if(filter){
          const userQuery = query(collection, where('role', '==', filter.role));
          const querySnapshot = getDocs(userQuery);
          querySnapshot.then(queryResult => {
            if(queryResult.empty){
              return null; 
            } else {
              return collection; 
            }
          });
        } else{
          return getDocs(collection);
        }
      } else {
        throw new Error('User Collection is not available');
      }
    });
    return null;
  }


  // create userProfile and associate with user auth info
  linkUserProfileToAuth(uid: string, user: UserModel) {
    this.firestore$.subscribe(firestore => {
      if(firestore){
        setDoc(doc(firestore, 'users', uid), user);
      } else {
        throw new Error('Firestore is not available');
      }
    });
  }


  
  // get user application by uid
  getUserAppDocRefByUid(uid: string): DocumentReference | null{
    this.firestore$.subscribe(firestore => {
      if(firestore){
        return doc(firestore, 'application', uid);
      } else {
        throw new Error('Firestore is not available');
      }
    });
    return null;
   }

  // get user application by username

  getUserAppDocRefByUsername(username: string): DocumentReference | null{
    this.firestore$.subscribe(firestore => {
      if(firestore){
        return doc(firestore, 'application', username);
      } else {
        throw new Error('Firestore is not available');
      }
    });
    return null;
   }
  // get all user applications with optional filter

  getUserApplicationsCollection(filter?: UserFilter): CollectionReference | null{
    this.userApplicationCollection$.subscribe(collection => {
      if(collection){
        if(filter){
          const userQuery = query(collection, where('role', '==', filter.role));
          const querySnapshot = getDocs(userQuery);
          querySnapshot.then(queryResult => {
            if(queryResult.empty){
              return null; 
            } else {
              return collection; 
            }
          });
        } else{
          return getDocs(collection);
        }
      } else {
        throw new Error('User Application Collection is not available');
      }
    });
    return null;
  }
  // create user application and associate with user profile
  linkUserAppToProfile(uid: string, userApp: UserApplicationModel) {
    this.firestore$.subscribe(firestore => {
      if(firestore){
        setDoc(doc(firestore, 'applications', uid), userApp);
      } else {
        throw new Error('Firestore is not available');
      }
    });
  }

  ngOnDestroy(): void {
    this.userCollectionSubject.complete();
    this.userCollectionLoadingSubject.complete();
    this.userCollectionErrorSubject.complete();

    this.userApplicationCollectionSubject.complete();
    this.userApplicationCollectionLoadingSubject.complete();
    this.userApplicationCollectionErrorSubject.complete();

    this.firestoreSubject.complete();
  }
}
