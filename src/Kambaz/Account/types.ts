export interface User {
  _id: string;
  username?: string;
  password?: string;
  role?: "STUDENT" | "FACULTY" | "ADMIN";
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AccountState {
  currentUser: User | null;
  users: User[];
  loading?: boolean;
  error?: string | null;
}