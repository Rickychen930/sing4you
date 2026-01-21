import { create } from 'zustand';
import type { AuthState } from '../types';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../services/authService';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,

  login: async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      // Ensure token is stored before updating state
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      set({
        isAuthenticated: true,
        user: response.user,
        accessToken: response.accessToken,
      });
    } catch (error) {
      // Clear any partial state on error
      localStorage.removeItem('accessToken');
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      if (process.env.NODE_ENV === 'development') {
        console.error('Error during logout:', error);
      }
    } finally {
      // Always clear local state and token
      localStorage.removeItem('accessToken');
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    }
  },

  checkAuth: () => {
    const token = authService.getAccessToken();
    set({
      isAuthenticated: !!token,
      accessToken: token,
    });
  },
}));