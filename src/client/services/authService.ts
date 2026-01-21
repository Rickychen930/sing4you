import { apiClient } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/admin/auth/login', credentials);
      // Ensure token is stored
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      } else {
        throw new Error('No access token received from server');
      }
      return response;
    } catch (error) {
      // Clear token on error
      localStorage.removeItem('accessToken');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/admin/auth/logout');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout error:', error);
      }
    } finally {
      localStorage.removeItem('accessToken');
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();