import { UserRole } from "./userRole.model";

export interface UserModel{
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  street: string;
  zip: string;
  state: string;
  password: string;
  requestedRole: UserRole;
  status: 'pending' | 'approved' | 'denied';
  dateRequested: Date;
  numDenied?: number;
  datesDenied?: Date[];
  dateApproved?: Date;
  assignedGL?: string;
  assignedAccounts?: string[];
  role?: UserRole;
}
