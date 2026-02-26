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
    console.log("Login API response:", response);

    // Handle different response formats from the API
    // API might return just the token string, or { token, ... }
    const token =
      typeof response === "string"
        ? response
        : response.token || response.Token;

    if (!token) {
      throw new Error("No token received from API");
    }

    // Construct user from the id in the payload since API doesn't return user object
    const user: AuthUser = {
      id: payload.id,
      type: "user", // Default to user, will be updated if admin
    };

    return { token, user };
  },
};
