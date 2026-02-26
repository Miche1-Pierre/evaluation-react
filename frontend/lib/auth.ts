/** Helpers for auth token — source of truth is the Zustand store. */

export function getStoredToken(): string | null {
  if (globalThis.window === undefined) return null;
  return localStorage.getItem("token");
}

export function removeStoredToken(): void {
  if (globalThis.window === undefined) return;
  localStorage.removeItem("token");
  localStorage.removeItem("auth-storage");
}
