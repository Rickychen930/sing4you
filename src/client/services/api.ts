import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { IApiResponse } from '../../shared/interfaces';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
        if (axiosError.response?.status === 401) {
          // Try to refresh token
          try {
            const refreshResponse = await axios.post<IApiResponse<{ accessToken: string }>>(
              `${API_BASE_URL}/api/admin/auth/refresh`,
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
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            window.location.href = '/admin/login';
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
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();