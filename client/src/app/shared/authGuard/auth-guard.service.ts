// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UserService } from '../userService/data-access/user.service';
import { UserRole } from '../dataModels/userProfileModel/userRole.model';
import { Auth } from '@angular/fire/auth';
import { UserFirestoreService } from '../firestoreService/userStore/data-access/user-firestore.service';
import { UserModel } from '../dataModels/userProfileModel/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private userAuth: Auth;
  constructor(
    private userFirestoreService: UserFirestoreService,
    private router: Router,
    private auth: Auth
  ) {this.userAuth = auth;}

  canActivate() {
    const userId = this.userAuth.currentUser?.uid;
    if(!userId) { return false; }
    return this.userFirestoreService.getUserObservable(userId).pipe(
      take(1),
      map(user => {
        // If no user or role is guest, allow access
        if (!user || (user as UserModel).role === UserRole.Guest) {
          console.log('User is not authorized');
          return false;
        }

        // Otherwise, redirect based on role
        console.log('User is authorized');
        console.log(user);
        return true;
      })
    );
    // return this.userService.userProfile$.pipe(
    //   take(1),
    //   map(user => {
    //     // If no user or role is guest, allow access
    //     if (!user || user.role === UserRole.Guest) {
    //       console.log('User is not authorized');
    //       return false;
    //     }

    //     // Otherwise, redirect based on role
    //     console.log('User is authorized');
    //     console.log(user);
    //     return true;
    //   })
    // );
  }
}
