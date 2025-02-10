
export enum UserRole {
  Active = "Active",
  Populate = "Populate",
  Write = "Write",
  Admin = "Admin",
  ResolutionManager = "ResolutionManager",
  UsersManager = "UsersManager"
}

export interface User {
  email: string;
  roles: UserRole[];
  lastActive?: string;
}

export interface Group {
  id: string;
  name: string;
}
