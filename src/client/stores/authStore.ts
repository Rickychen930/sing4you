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
      // Token is already stored in authService.login, just verify it exists
      if (!response || !response.accessToken) {
        throw new Error('Invalid login response');
      }
      // Update state synchronously after successful login
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
    // Only update state if token exists, otherwise keep current state
    // This prevents clearing state if checkAuth is called before login
    if (token) {
      set({
        isAuthenticated: true,
        accessToken: token,
      });
    } else {
      // Only clear if we're sure there's no token
      set({
        isAuthenticated: false,
        accessToken: null,
        user: null,
      });
    }
  },
}));