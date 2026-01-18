// Re-export shared interfaces
export * from '../../shared/interfaces';

// Frontend-specific types
export interface ApiClient {
  get: <T>(url: string) => Promise<T>;
  post: <T>(url: string, data?: unknown) => Promise<T>;
  put: <T>(url: string, data?: unknown) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  accessToken: string | null;
}

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  requiresAuth?: boolean;
}