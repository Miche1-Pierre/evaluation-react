import { api } from "@/lib/api";
import type { AuthUser } from "@/types/user";

export interface LoginPayload {
  id: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ApiLoginResponse {
  token?: string;
  Token?: string;
}

/**
 * Decode JWT token to extract user information
 */
function decodeJWT(token: string): { _id: string; type: string } {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
  const payload = JSON.parse(atob(base64));
  return payload;
}

export const authService = {
  /**
   * POST /login
   * Returns a JWT token and the logged-in user.
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<ApiLoginResponse | string>(
      "/login",
      payload,
    );

    // API returns the token as a plain string
    const token =
      typeof response === "string"
        ? response
        : response.token || response.Token;

    if (!token) {
      throw new Error("No token received from API");
    }

    // Decode JWT to extract user info
    const decoded = decodeJWT(token);
    const user: AuthUser = {
      id: decoded._id,
      type: decoded.type as 'user' | 'admin',
    };

    return { token, user };
  },
};
