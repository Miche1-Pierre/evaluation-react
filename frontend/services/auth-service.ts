import { api } from '@/lib/api';
import type { AuthUser } from '@/types/user';

export interface LoginPayload {
  id: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  /**
   * POST /auth/login
   * Returns a JWT token and the logged-in user.
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', payload);
  },
};
