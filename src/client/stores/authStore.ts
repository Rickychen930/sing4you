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
      set({
        isAuthenticated: true,
        user: response.user,
        accessToken: response.accessToken,
      });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
    });
  },

  checkAuth: () => {
    const token = authService.getAccessToken();
    set({
      isAuthenticated: !!token,
      accessToken: token,
    });
  },
}));