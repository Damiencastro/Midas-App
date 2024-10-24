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
import { UserModel } from '../../models/user.model';
import { UserDisplayUtils } from './user-display.utils';
import { UserRole } from '../../models/userRole.model';
import { profile } from 'console';

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

  // Derived observables
  readonly isLoggedIn$ = this.userProfile$.pipe(
    map(user => user !== null)
  );

  readonly displayName$ = this.userProfile$.pipe(
    map(UserDisplayUtils.formatDisplayName),
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
  


  readonly viewModel$ = combineLatest({
    displayName: this.displayName$,
    isAdmin: this.isAdmin$,
    isManager: this.isManager$,
    isAccountant: this.isAccountant$
  });

  
  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore
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
        return this.getUserProfile((firebaseUser as FirebaseUser).uid).pipe(
          tap({
            next: (profile) => {
              this.userProfileSubject.next(profile);
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

  /**
   * Registers a new user with email and password
   * Creates their profile in Firestore after successful registration
   */
  async application(userInfo: UserModel): Promise<void> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      // Create the Firebase auth user
      
      
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        UserDisplayUtils.formatUsername(userInfo) + '@midas-app.com',
        userInfo.password
      ).then((userCred) => {
        console.log("User created successfully");
        console.log(credential);
        this.createUserProfile(userCred.user, userInfo);
      }).catch((error) => {
        console.log(error);
        this.errorSubject.next(this.getErrorMessage(error));
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      this.errorSubject.next(this.getErrorMessage(error));
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async checkusername(candidateUsername: string): Promise<boolean> {
    try{

      const userRef = collection(getFirestore(), 'users');

      const q = query(userRef, where('username', '==', candidateUsername));

      const querySnapshot = await getDocs(q);

      return !querySnapshot.empty;
    } catch(error) {
      console.error('Username check failed:', error);
      throw error;
    }
  }


  /**
   * Logs in an existing user with email and password
   */
  async login(email: string, password: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      await signInWithEmailAndPassword(this.auth, email, password);
      
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
  private async createUserProfile(
    firebaseUser: FirebaseUser,
    profileInformation: UserModel
  ): Promise<void> {
    const userProfile: UserModel = {
      id: firebaseUser.uid,
      username: UserDisplayUtils.formatUsername(profileInformation),
      firstname: profileInformation.firstname,
      lastname: profileInformation.lastname,
      phone: profileInformation.phone,
      street: profileInformation.street,
      zip: profileInformation.zip,
      state: profileInformation.state,
      role: profileInformation.role,
      password: '',
    };

    const userRef = this.getUserDocRef(firebaseUser.uid);
    await setDoc(userRef, userProfile);
  }

  /**
   * Gets a user's profile from Firestore
   */
  private getUserProfile(uid: string): Observable<UserModel> {
    return from(getDoc(this.getUserDocRef(uid))).pipe(
      map(doc => {
        if (!doc.exists()) {
          throw new Error('User profile not found');
        }
        return doc.data() as UserModel;
      })
    );
  }

  /**
   * Updates a user's profile in Firestore
   */
  async updateProfile(updates: Partial<UserModel>): Promise<void> {
    try {
      const currentUser = this.userProfileSubject.getValue();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      // Update Firestore
      await updateDoc(
        this.getUserDocRef(currentUser.id),
        { ...updates, lastUpdated: new Date() }
      );

      // Update local state
      this.userProfileSubject.next({
        ...currentUser,
        ...updates
      });
      
    } catch (error) {
      console.error('Profile update failed:', error);
      this.errorSubject.next(this.getErrorMessage(error));
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Gets a reference to a user's Firestore document
   */
  private getUserDocRef(uid: string): DocumentReference {
    return doc(this.firestore, 'users', uid);
  }

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
