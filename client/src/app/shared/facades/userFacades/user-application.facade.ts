import { Injectable } from "@angular/core";
import { UserFirestoreService } from "../../services/firestoreService/user-firestore.service";
import { EventBusService, EventType } from "../../services/event-bus.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { UserApplication, UserModel } from "../../dataModels/userProfileModel/user.model";
import { UserProfileStateService } from "../../states/user-profile-state.service";
import { AuthStateService } from "../../states/auth-state.service";


@Injectable({
    providedIn: 'root'
})
export class UserApplicationFacade {

// **Business Purpose**: Orchestrates new user registration and approval process.

    constructor(
        private userProfileState: UserProfileStateService,
        private authStateService: AuthStateService,
        private errorHandling: ErrorHandlingService,
        private eventBus: EventBusService,
    ) {}
    
    // Submit a new user application
    submitApplication(userApplication: UserApplication): Promise<void> {
        return this.userProfileState.submitApplication(userApplication).then(() => {
            this.eventBus.emit({
                
                type: EventType.ACCOUNT_CREATED,
                payload: userApplication,
                source: 'user-application-facade'
            });
        }).catch((error) => {
            this.errorHandling.handleError(error, null);
        });
    }



    // Get a user's application status

    // Approve a user application

    // Reject a user application

    // Get all user applications

    // 
    
}


/* 
 *  ### UserRegistrationFacade
 *
 *  **Key Responsibilities**:
 *  - Registration workflow coordination
 *  - Username generation rules
 *  - Application status management
 *  - Approval process orchestration
 *  - Initial role assignment
 *
 *  **Interacts With**:
 *  - UserSecurityFacade
 *  - UserProfileManagementFacade
 *  - NotificationWorkflowFacade
 */

// createUsername(userProfile: UserModel){
//     console.log(userProfile)
//     const candidateUsername = UserDisplayUtils.formatUsername(userProfile);
//     this.checkUsername(candidateUsername).then((isAvailable) => {
//       if(isAvailable){
//         userProfile.username = candidateUsername;
//       } else {
//         userProfile.username = candidateUsername + Math.random();
//         return 
//       }
//     });
//     console.log(userProfile);
//     return userProfile.username;
//   }

//   checkUsername(candidateUsername: string): Promise<boolean> {
//     return firstValueFrom(this.getAllUsersWhere('username', '==', candidateUsername)).then(users => {
//       return users.length === 0;
//     });
//   }
