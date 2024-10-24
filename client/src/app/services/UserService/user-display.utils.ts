import { UserModel } from "../../models/user.model";
import { UserRole } from "../../models/userRole.model";
import { UserService } from "./user.service";

export class UserDisplayUtils {
    static getRoleTitle(role: UserRole): string {
        switch (role) {
            case UserRole.Accountant:
                return "Accountant";
            case UserRole.Manager:
                return "Manager";
            case UserRole.Administrator:
                return "Administrator";
            default:
                return "Guest";
        }
    }

    static formatFullName(user: UserModel): string {
        if(user.firstname || user.lastname) {
            return `${user.firstname || ''} ${user.lastname || ''}`.trim();
        }

        return '';
    }

    static formatDisplayName(user: UserModel | null): string {
        if(!user) return 'Guest';

        const fullName = this.formatFullName(user);
        const roleTitle = this.getRoleTitle(user.role);
        
        return `${fullName} (${roleTitle})`;
    }

    static formatUsername(user: UserModel): string {
        return  user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1) + this.dateCreatedFormat();

    }

    static dateCreatedFormat(): string {
        const date = new Date();
        const fullyear = date.getFullYear();
        const month = date.getMonth();

        const doubleDigitYear = fullyear.toString().slice(2);
        const doubleDigitMonth = month < 10 ? `0${month}` : month.toString();
        return `${doubleDigitYear}${doubleDigitMonth}`;
    }
}