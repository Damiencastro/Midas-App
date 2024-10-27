import { Injectable, OnDestroy, inject } from '@angular/core';
import { 
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  DocumentReference,
  getFirestore,
  collection,
  where,
  query,
  getDocs
} from '@angular/fire/firestore';
import { 
  BehaviorSubject, 
  Observable, 
  Subject, 
  from, 
  of, 
  EMPTY,
  catchError,
  map, 
  switchMap, 
  take, 
  takeUntil,
  tap,
  distinctUntilChanged,
  combineLatest
} from 'rxjs';
import { UserDisplayUtils } from '../utils/user-display.utils';
import { UserModel } from '../../dataModels/userProfileModel/user.model';
import { UserRole } from '../../dataModels/userProfileModel/userRole.model';
import { UserFirestoreService } from '../../firestoreService/userStore/data-access/user-firestore.service';
import { userInfo } from 'os';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  
  // Private subjects for state management
  private readonly userProfileSubject = new BehaviorSubject<UserModel | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(true);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  
  // Subject for cleanup on destroy
  private readonly destroySubject = new Subject<void>();

  // Public observables that components can subscribe to
  readonly userProfile$ = this.userProfileSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  userFirestoreService = inject(UserFirestoreService);


  // Derived observables
  readonly isLoggedIn$ = this.userProfile$.pipe(
    map(user => !!user)
  );

  readonly username$ = this.userProfile$.pipe(
    map(user => {
      if(!user) {
        return;
      }
      return UserDisplayUtils.formatDisplayName(user)
    }),
    distinctUntilChanged()
  );

  readonly viewRole$ = this.userProfile$.pipe(
    map(user => user?.role),
    distinctUntilChanged()
  );

  readonly viewPhone$ = this.userProfile$.pipe(
    map(user => user?.phone),
    distinctUntilChanged()
  );

  readonly isAdmin$ = this.userProfile$.pipe(
    map(user => user?.role === UserRole.Administrator),
    distinctUntilChanged()
  );

  readonly isManager$ = this.userProfile$.pipe(
    map(user => user?.role === UserRole.Manager),
    distinctUntilChanged()
  );

  readonly isAccountant$ = this.userProfile$.pipe(
    map(user => user?.role === UserRole.Accountant),
    distinctUntilChanged()
  );

  readonly userIsAuthorized$ = this.userProfile$.pipe(
    map(user => user !== null && user.role !== UserRole.Guest),
    distinctUntilChanged()
  );

  
  constructor(
    private readonly auth: Auth,
  ) {
    // Initialize the auth state subscription
    this.initializeAuthStateSubscription();
  }

  /**
   * Initializes the subscription to Firebase auth state changes
   * This handles automatic profile loading when auth state changes
   */
  private initializeAuthStateSubscription(): void {
    // Subscribe to Firebase auth state
    authState(this.auth).pipe(
      takeUntil(this.destroySubject), // Cleanup on destroy
      tap(() => this.loadingSubject.next(true)), // Show loading state
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          // No user logged in, clear the profile
          this.userProfileSubject.next(null);
          this.loadingSubject.next(false);
          return EMPTY;
        }
        console.log(firebaseUser);
        // User is logged in, get their profile
        return this.userFirestoreService.getUserObservable((firebaseUser as FirebaseUser).uid).pipe(
          tap({
            next: (profile: UserModel | null) => {
              if(profile) {
                console.log(profile);
                this.userProfileSubject.next(profile);
              } else{
                this.userProfileSubject.next(null);
              }
              this.loadingSubject.next(false);
              this.errorSubject.next(null);
            },
            error: (error) => {
              console.error('Error loading user profile:', error);
              this.errorSubject.next('Failed to load user profile');
              this.loadingSubject.next(false);
            }
          })
        );
      })
    ).subscribe();
  }

  //  This function is called when a user registers for the app
  async application(userInfo: UserModel): Promise<void> {
    const username = this.userFirestoreService.createUsername(userInfo)
    try { //First, we indicate that the app is loading and clear any previous errors
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
      let userCredential = null;
      
      
      
      const credential = await createUserWithEmailAndPassword( // Then, we need to create the authentication entry
        this.auth, //Auth instance
        username + '@midas-app.com', // This appends an email address to the username to form the email
        userInfo.password
      ).then((userCred) => { //Then, we get the user credential returned from the promise
        this.userFirestoreService.linkUserProfileToAuth(userCred.user.uid, userInfo); // The user is linked with the credential
        // console.log(userCred);
      }).catch((error) => {
        console.log(error);
        throw error;
      });
    } catch (error) {
      console.error('Registration failed:', error);
      
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }
  /**
   * Logs in an existing user with email and password
   */
  async login(username: string, password: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
      console.log(username);
      console.log(password);
      await signInWithEmailAndPassword(this.auth, username + '@midas-app.com', password).then((userCred) => {
        console.log(userCred);
          this.userFirestoreService.getUserObservable(userCred.user.uid).subscribe((user) => {
            if(!user) {throw new Error('User not found');}
            this.userProfileSubject.next(user);
            this.userProfile$.forEach((user) => {console.log(user);});
          });
      });
      console.log('Login successful');
      console.log(this.auth.currentUser);
      this.userProfile$.forEach((user) => {
        console.log(user);
      });
      
    } catch (error) {
      console.error('Login failed:', error);
      this.errorSubject.next(this.getErrorMessage(error));
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Logs out the current user
   */
  async logout(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      await signOut(this.auth);
      // userProfileSubject will be cleared by auth state subscription
      
    } catch (error) {
      console.error('Logout failed:', error);
      this.errorSubject.next(this.getErrorMessage(error));
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Creates a new user profile in Firestore
   */
  // private async submitUserApplication(
  //   firebaseUser: FirebaseUser,
  //   profileInformation: UserApplicationModel
  // ): Promise<void> {
  //   const userProfile: UserApplicationModel = {
  //     id: firebaseUser.uid,
  //     username: profileInformation.username,
  //     firstname: profileInformation.firstname,
  //     lastname: profileInformation.lastname,
  //     phone: profileInformation.phone,
  //     street: profileInformation.street,
  //     zip: profileInformation.zip,
  //     state: profileInformation.state,
  //     requestedRole: profileInformation.requestedRole,
  //     password: '',
  //     status: 'pending',
  //     dateRequested: new Date(),

      
  //   };
  //   console.log(userProfile);

    
  // }

  /**
   * Gets a user's profile from Firestore
   */

  /**
   * Updates a user's profile in Firestore
   */
  // async updateProfile(updates: Partial<UserModel>): Promise<void> {
  //   try {
  //     const currentUser = this.userProfileSubject.getValue();
  //     if (!currentUser) {
  //       throw new Error('No user logged in');
  //     }

  //     this.loadingSubject.next(true);
  //     this.errorSubject.next(null);

  //     // Update Firestore
  //     await updateDoc(
  //       this.userFirestoreService.getUserDocRefByUid(currentUser.id),
  //       { ...updates, lastUpdated: new Date() }
  //     );

  //     // Update local state
  //     this.userProfileSubject.next({
  //       ...currentUser,
  //       ...updates
  //     });
      
  //   } catch (error) {
  //     console.error('Profile update failed:', error);
  //     this.errorSubject.next(this.getErrorMessage(error));
  //     throw error;
  //   } finally {
  //     this.loadingSubject.next(false);
  //   }
  // }

  /**
   * Converts Firebase errors to user-friendly messages
   */
  private getErrorMessage(error: any): string {
    if (error?.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'This email is already registered';
        case 'auth/user-not-found':
          return 'User not found';
        case 'auth/wrong-password':
          return 'Invalid password';
        // Add more error cases as needed
        default:
          return 'An unexpected error occurred';
      }
    }
    return error?.message || 'An unexpected error occurred';
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  /**
   * Gets the current user synchronously
   * Use with caution - prefer subscribing to userProfile$ observable
   */
  getCurrentUser(): UserModel | null {
    return this.userProfileSubject.getValue();
  }

  
}
