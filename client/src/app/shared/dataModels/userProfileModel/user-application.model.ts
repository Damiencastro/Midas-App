import { UserRole } from "./userRole.model";

export interface UserApplicationModel{
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
}
