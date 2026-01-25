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
  private requestCache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds cache for GET requests

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 10000, // 10 second timeout
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

  async get<T>(url: string, useCache: boolean = true): Promise<T> {
    try {
      // Check cache for GET requests
      if (useCache) {
        const cacheKey = url;
        const cached = this.requestCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          return cached.data as T;
        }
        
        // Check if request is already pending (deduplication)
        const pendingRequest = this.pendingRequests.get(cacheKey);
        if (pendingRequest) {
          return pendingRequest as Promise<T>;
        }
      }

      // Create request promise
      const requestPromise = this.client.get<IApiResponse<T>>(url)
        .then((response) => {
          if (!response.data.success && response.data.error) {
            throw new Error(response.data.error);
          }
          
          const data = response.data.data as T;
          
          // Cache successful GET responses
          if (useCache) {
            this.requestCache.set(url, { data, timestamp: Date.now() });
          }
          
          // Remove from pending requests
          this.pendingRequests.delete(url);
          
          return data;
        })
        .catch((error) => {
          // Remove from pending requests on error
          this.pendingRequests.delete(url);
          throw error;
        });

      // Store pending request for deduplication
      if (useCache) {
        this.pendingRequests.set(url, requestPromise);
      }

      return requestPromise as Promise<T>;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      
      // Handle connection refused error
      if (axiosError.response === undefined) {
        const errorMessage = import.meta.env.DEV
          ? 'Cannot connect to server. Please ensure the server is running at http://localhost:3001'
          : 'Cannot connect to server. Please try again later.';
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
          ? 'Cannot connect to server. Please ensure the server is running at http://localhost:3001'
          : 'Cannot connect to server. Please try again later.';
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
          ? 'Cannot connect to server. Please ensure the server is running at http://localhost:3001'
          : 'Cannot connect to server. Please try again later.';
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
          ? 'Cannot connect to server. Please ensure the server is running at http://localhost:3001'
          : 'Cannot connect to server. Please try again later.';
        throw new Error(errorMessage);
      }
      
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
      throw error;
    }
  }

  // Clear cache (useful after mutations)
  clearCache(): void {
    this.requestCache.clear();
  }

  // Clear specific cache entry
  clearCacheEntry(url: string): void {
    this.requestCache.delete(url);
  }
}

export const apiClient = new ApiClient();