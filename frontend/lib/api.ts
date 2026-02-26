const API_BASE = "http://localhost:4555";

/** Read token from localStorage (set at login). */
function getToken(): string | null {
  if (globalThis.window === undefined) return null;
  return localStorage.getItem("token");
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly endpoint?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const body = await res.json();
        message = body?.message ?? body?.error ?? message;
      } catch {}
      
      const error = new ApiError(res.status, message, path);
      
      // Log des erreurs pour debug
      console.error(`[API Error] ${options.method || 'GET'} ${path}:`, {
        status: res.status,
        message,
      });

      // Redirection auto si non authentifié
      if (error.isUnauthorized() && typeof globalThis.window !== 'undefined') {
        console.warn('Session expirée, redirection vers /login...');
        // Éviter les boucles de redirection
        if (!globalThis.window.location.pathname.includes('/login')) {
          globalThis.window.location.href = '/login';
        }
      }

      throw error;
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
  } catch (error) {
    // Si ce n'est pas une ApiError, c'est probablement une erreur réseau
    if (!(error instanceof ApiError)) {
      console.error(`[Network Error] ${options.method || 'GET'} ${path}:`, error);
      throw new ApiError(0, 'Erreur de connexion au serveur', path);
    }
    throw error;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
