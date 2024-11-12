import { Injectable } from "@angular/core";
import { UserRole } from "../../dataModels/userModels/userRole.model";
import { Observable, Subject, catchError, combineLatest, filter, from, of, switchMap, tap } from "rxjs";
import { UserAdminFirestoreService } from "../../services/firestoreService/user-admin-firestore.service";
import { UserAdminFacade } from "./user-administration.facade";
import { AuthStateService } from "../../states/auth-state.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { Auth, User as FirebaseUser } from "@angular/fire/auth";
import { doc } from "@angular/fire/firestore";
import { UserApplication, UserModel } from "../../dataModels/userModels/user.model";
import { AccountFirestoreService } from "../../services/firestoreService/account-firestore.service";
import { PermissionType } from "../../dataModels/userModels/permissions.model";
import { AccountAccessEvent, EventType } from "../../dataModels/loggingModels/event-logging.model";
import { EventLogService } from "../../services/event-log.service";
import { UserProfileFacade } from "./user-profile.facade";



export interface SuspensionInfo {
    userId: string;
    reason: string;
    startDate: Date;
    endDate?: Date;  // undefined/null if permanent suspension
    suspendedBy: string;  // UID of admin who initiated suspension
}
interface SecurityStatusRequest {
    userId: string;
    includeHistory?: boolean;  // Optional flag for including historical data
}

// Output DTOs
interface SecurityStatusResponse {
    isLocked: boolean;
    isSuspended: boolean;
    passwordStatus: 'valid' | 'expiring' | 'expired';
    failedAttempts: number;
    lastUpdated: Date;
}

export interface SecurityStatus {
    isLocked: boolean;
    suspension: SuspensionInfo | null;
    passwordStatus: 'valid' | 'expiring' | 'expired';
    failedAttempts: number;
      
}

export interface PermissionCheckResult {
    granted: boolean;
    reason?: string;  // Optional explanation if permission denied
    requiredRole?: UserRole;  // If denial is role-based
}

@Injectable({ providedIn: 'root' })
export class UserSecurityFacade {
  
  
    
    
  // Role-Based Authorization
//   readonly hasRole$(role: UserRole): Observable<PermissionCheckResult>

  // Permission/Access Control
//   readonly hasPermission$(permission: Permission): Observable<PermissionCheckResult>
//   readonly hasPermissions(permissions: Permission[]): Observable<PermissionCheckResult[]>
//   readonly canAccess(feature: FeatureFlag): Observable<boolean>
//   readonly getAccessibleFeatures(): Observable<FeatureFlag[]>

  // Account Status Observables
//   readonly isAccountLocked$: Observable<boolean>
//   readonly passwordExpiresIn$: Observable<number>
//   readonly requiresPasswordChange$: Observable<boolean>
  
  // Consolidated Security Status
  readonly securityStatus$ = new Subject<SecurityStatus>();

    constructor(    private userAdminFirestore: UserAdminFirestoreService,
                    private errorHandling: ErrorHandlingService,
                    private authState: AuthStateService,
                    private accountFirestore: AccountFirestoreService,
                    private eventLogging: EventLogService,
                    private userProfileFacade: UserProfileFacade) 
    {}


                                //-----------------------------------------//
                                /* * * * * Authentication Methods * * * * */
                                //-----------------------------------------//

    login(username: string, password: string): Observable<boolean> {
        const userStatus = this.getUserSecurityStatus(username);
            return userStatus.pipe(
            switchMap(status => {
                if (status.isLocked) {
                    return of(false);
                }
                if (status.suspension) {
                    return of(false);
                }
                if (status.passwordStatus === 'expired') {
                    return of(false);
                }
                // Check failed login attempts
                if (status.failedAttempts >= 3) {
                    return of(false);
                }
                // Authenticate user
                    return of(true);
                }),
            catchError((error) => this.errorHandling.handleError(error, false)),
            tap((success) => { if(success) { this.authState.login(username, password) }})
    )
    }

    requestSystemAccess(user: UserApplication): Promise<void> {
        this.userProfileFacade.createProfile(user, this.authState.user$);
        return this.userAdminFirestore.submitApplication(user, this.authState.user$);
    }


    private getUserSecurityStatus(uid: string): Observable<SecurityStatus> {
        return this.userAdminFirestore.getUserSecurityStatus(uid).pipe(
            // Filter out null values
            filter((status): status is SecurityStatus => status !== null),
            catchError((error) => {
                return this.errorHandling.handleError(error, {
                    isLocked: true,
                    suspension: null,
                    passwordStatus: 'expired',
                    failedAttempts: 3,
                } as SecurityStatus);
            })
        );
    }
    // Password Management Methods
    validatePassword(uid: string, password: string): Observable<boolean> {
        const passwordComplexity = this.validatePasswordComplexity(password);
        const passwordHistory = this.validatePasswordHistory(uid, password);
        return combineLatest([passwordComplexity, passwordHistory]).pipe(
            switchMap(([complexity, history]) => {
                if (!complexity) {
                    return of(false);
                }
                if (!history) {
                    return of(false);
                }
                return of(true);
            }),
            catchError((error) => this.errorHandling.handleError(error, false))
        );
        
    }
                                //--------------------------------------------//
                                /* * * * * Access Management Methods * * * * */
                                //-------------------------------------------//

    grantAccess(accountId: string, userId: string): Promise<void> {
        return this.accountFirestore.addAuthorizedUser(accountId, userId);
    }

    revokeAccess(accountId: string, userId: string): Promise<void> {
        return this.accountFirestore.removeAuthorizedUser(accountId, userId);
    }

    getAccountAccessList(accountId: string): Promise<string[]> {
        return this.accountFirestore.getAuthorizedUsers(accountId);
      }

                                //--------------------------------------------//
                                /* * * * * Access Validation Methods * * * * */
                                //-------------------------------------------//

    validateAccess(user: UserModel, accountId: string): Promise<boolean> {
        return this.accountFirestore.getAuthorizedUsers(accountId).then((authorizedUserIds: string[]) => {
           const authorized = authorizedUserIds.includes(user.id);
           if(authorized) {
               this.eventLogging.logEvent(EventType.ACCOUNT_ACCESS, {
                accountId: accountId,
                userId: user.id,
                authorized: true} as AccountAccessEvent);
               return true;
           }
           return authorized;
        });
    }

    validatePermissions(permissionType: PermissionType, accountId: string): boolean {
        // Check if user has permission required to perform action
        // log the validation event
        throw new Error("Method not implemented.");
    }
    

                                //----------------------------------------------//
                                /* * * * * Password Management Methods * * * * */
                                //---------------------------------------------//
    // // Password Validation & Change
    // validatePasswordComplexity(password: string): ValidationResult;
    validatePasswordComplexity(password: string): Observable<boolean> {
        
        return from(
            of(password.length >= 8
            && /[A-Z]/.test(password)
            && /[a-z]/.test(password)
            && /[0-9]/.test(password)
            && /[^A-Za-z0-9]/.test(password))
        );
    }
    
    // validatePasswordHistory(userId: string, newPassword: string): Observable<boolean>;
    validatePasswordHistory(uid: string, password: string): Observable<boolean> {
        return of(true);
        // const userDocRef = doc(this.firestore, 'users', uid);
    }
    // changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void>;
    // forcePasswordChange(userId: string): Observable<void>;

    // // Password Reset
    // initiatePasswordReset(userId: string): Observable<ResetToken>;
    // validateResetToken(token: string): Observable<boolean>;
    // completePasswordReset(token: string, newPassword: string): Observable<void>;
    // cancelPasswordReset(token: string): Observable<void>;

    // // Password Expiration
    // checkPasswordExpiration(userId: string): Observable<ExpirationStatus>;
    // getPasswordExpirationDate(userId: string): Observable<Date>;
    // extendPasswordExpiration(userId: string, duration: Duration): Observable<void>;

    // // Password History
    // getPasswordChangeHistory(userId: string): Observable<PasswordHistory[]>;
    // clearPasswordHistory(userId: string): Observable<void>;


                                //--------------------------------------------//
                                /* * * * * Security Question Methods * * * * */
                                //-------------------------------------------//

// Security Question Methods
// setSecurityQuestions
// updateSecurityAnswers
// validateSecurityAnswers
// getSecurityQuestions
// resetSecurityQuestions

                                //------------------------------------------//
                                /* * * * * Security Status Methods * * * * */
                                //-----------------------------------------//

// Security Status Methods
// getSecurityStatus
// getSecurityMetrics

                                //-----------------------------------------//
                                /* * * * * Security Alert Methods * * * * */
                                //----------------------------------------//
// Security Alert Methods
// createSecurityAlert
// getActiveSecurityAlerts
// dismissSecurityAlert
// subscribeToSecurityAlerts

                                //--------------------------------------------//
                                /* * * * * Security Recovery Methods * * * * */
                                //-------------------------------------------//
// initiateAccountRecovery
// validateRecoverySteps
// completeAccountRecovery
// cancelAccountRecovery

  
}









/*## User Management Facades

isUserAuthorized - if not, check if user has pending application. If it does, return 'pending' status. If not, return 'unauthorized' status.

### UserSecurityFacade
**Business Purpose**: Manages user security policies and enforcement.

**Key Responsibilities**:
- Password expiration policies
- Account lockout rules
- Suspension management
- Security alert coordination
- Access control policies

**Interacts With**:
- UserProfileManagementFacade
- NotificationWorkflowFacade
- SystemConfigurationFacade

### UserProfileManagementFacade
**Business Purpose**: Handles user profile operations and updates.

**Key Responsibilities**:
- Profile update workflows
- Role change management
- User status changes
- Profile validation rules
- Access level changes

**Interacts With**:
- NotificationWorkflowFacade
- SystemConfigurationFacade
*/