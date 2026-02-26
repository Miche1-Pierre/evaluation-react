export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  password?: string;
  type: UserRole;
}

/** Stored in Zustand after login */
export interface AuthUser {
  id: string;
  type: UserRole;
}
