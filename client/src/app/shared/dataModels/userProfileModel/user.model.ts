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
  role: UserRole;
}
