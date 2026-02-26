import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/user";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAdmin: false,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        // Cookie for middleware route protection (no httpOnly = readable by middleware in Next.js edge)
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        set({
          user,
          token,
          isAdmin: user.type === "admin",
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0";
        set({
          user: null,
          token: null,
          isAdmin: false,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // persisted key in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        // Re-derive computed booleans after hydration
        if (state) {
          state.isAuthenticated = !!state.token;
          state.isAdmin = state.user?.type === "admin";
        }
      },
    },
  ),
);
