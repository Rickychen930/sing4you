import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { IApiResponse } from '../../shared/interfaces';

// In development, use relative URL to leverage Vite proxy
// In production, use the configured API URL or default to same origin
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? '' : (typeof window !== 'undefined' ? window.location.origin : ''));

interface AxiosErrorResponse {
  response?: {
    data?: {
      error?: string;
      success?: boolean;
    };
    status?: number;
  };
  config?: AxiosRequestConfig;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        const axiosError = error as AxiosErrorResponse;
        const requestUrl = axiosError.config?.url || '';
        
        // Don't try to refresh token for auth endpoints (login, refresh, logout)
        const isAuthEndpoint = requestUrl.includes('/auth/login') || 
                              requestUrl.includes('/auth/refresh') || 
                              requestUrl.includes('/auth/logout');
        
        if (axiosError.response?.status === 401 && !isAuthEndpoint) {
          // Try to refresh token only for non-auth endpoints
          try {
            const refreshUrl = API_BASE_URL 
              ? `${API_BASE_URL}/api/admin/auth/refresh`
              : '/api/admin/auth/refresh';
            const refreshResponse = await axios.post<IApiResponse<{ accessToken: string }>>(
              refreshUrl,
              {},
              { withCredentials: true }
            );
            const accessToken = refreshResponse.data.data?.accessToken;
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
              
              // Retry original request
              if (axiosError.config) {
                axiosError.config.headers = axiosError.config.headers || {};
                axiosError.config.headers.Authorization = `Bearer ${accessToken}`;
                return this.client.request(axiosError.config);
              }
            }
          } catch {
            // Clear token and redirect to login on refresh failure
            localStorage.removeItem('accessToken');
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/admin/login')) {
              window.location.href = '/admin/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    try {
      const response = await this.client.get<IApiResponse<T>>(url);
      if (!response.data.success && response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data.data as T;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      
      // Handle connection refused error
      if (axiosError.response === undefined) {
        const errorMessage = import.meta.env.DEV
          ? 'Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3001'
          : 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
        throw new Error(errorMessage);
      }
      
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
      throw error;
    }
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.post<IApiResponse<T>>(url, data);
      if (!response.data.success && response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data.data as T;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      
      // Handle connection refused error
      if (axiosError.response === undefined) {
        const errorMessage = import.meta.env.DEV
          ? 'Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3001'
          : 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
        throw new Error(errorMessage);
      }
      
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
      throw error;
    }
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.put<IApiResponse<T>>(url, data);
      if (!response.data.success && response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data.data as T;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      
      // Handle connection refused error
      if (axiosError.response === undefined) {
        const errorMessage = import.meta.env.DEV
          ? 'Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3001'
          : 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
        throw new Error(errorMessage);
      }
      
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<IApiResponse<T>>(url);
      if (!response.data.success && response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data.data as T;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      
      // Handle connection refused error
      if (axiosError.response === undefined) {
        const errorMessage = import.meta.env.DEV
          ? 'Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3001'
          : 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
        throw new Error(errorMessage);
      }
      
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();