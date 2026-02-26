import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export function useAuth() {
  const store = useAuthStore();
  const router = useRouter();

  async function login(id: string, password: string) {
    const { token, user } = await authService.login({ id, password });
    store.setAuth(user, token);
  }

  function logout() {
    store.clearAuth();
    router.push("/login");
  }

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    login,
    logout,
  };
}
