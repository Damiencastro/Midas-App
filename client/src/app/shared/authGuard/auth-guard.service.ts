// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UserService } from '../userService/data-access/user.service';
import { UserRole } from '../dataModels/userProfileModel/userRole.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate() {
    return this.userService.userProfile$.pipe(
      take(1),
      map(user => {
        // If no user or role is guest, allow access
        if (!user || user.role === UserRole.Guest) {
          return true;
        }

        // Otherwise, redirect based on role
        switch (user.role) {
          case UserRole.Administrator:
            this.router.navigate(['/admin-dashboard']);
            break;
          case UserRole.Manager:
            this.router.navigate(['/manager-dashboard']);
            break;
          case UserRole.Accountant:
            this.router.navigate(['/accountant-dashboard']);
            break;
        }
        return false;
      })
    );
  }
}
