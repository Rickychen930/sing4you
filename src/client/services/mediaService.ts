import { apiClient } from './api';
import type { IMedia } from '../../shared/interfaces';

// In development, use relative URL to leverage Vite proxy
// In production, use the configured API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export class MediaService {
  async getAll(): Promise<IMedia[]> {
    return apiClient.get<IMedia[]>('/api/media');
  }

  async getById(id: string): Promise<IMedia> {
    return apiClient.get<IMedia>(`/api/media/${id}`);
  }

  async getByVariationId(variationId: string): Promise<IMedia[]> {
    return apiClient.get<IMedia[]>(`/api/variations/${variationId}/media`);
  }

  async create(data: Partial<IMedia>): Promise<IMedia> {
    return apiClient.post<IMedia>('/api/admin/media', data);
  }

  async update(id: string, data: Partial<IMedia>): Promise<IMedia> {
    return apiClient.put<IMedia>(`/api/admin/media/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/media/${id}`);
  }

  async uploadFile(file: File): Promise<{ data: { url: string; publicId?: string } }> {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('file', file);

    // In development, use relative URL to leverage Vite proxy (which proxies to backend)
    // In production, use API_BASE_URL if set, otherwise use same origin (backend serves frontend)
    // CRITICAL: Always use relative URL in development to use Vite proxy
    // In production, if VITE_API_URL is set, use it; otherwise backend serves from same origin
    const uploadUrl = import.meta.env.DEV
      ? '/api/admin/media/upload'  // Use Vite proxy in development
      : (API_BASE_URL 
          ? `${API_BASE_URL}/api/admin/media/upload`  // Use full URL if API_BASE_URL is set
          : '/api/admin/media/upload');  // Use relative URL if backend serves frontend
    
    let response: Response;
    try {
      response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          // Don't set Content-Type header - browser will set it with boundary for FormData
        },
        credentials: 'include',
        body: formData,
      });
    } catch (error) {
      // Handle connection refused error
      console.error('Upload error:', error);
      const errorMessage = import.meta.env.DEV
        ? 'Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3001'
        : 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Upload failed with status ${response.status}`;
      console.error('Upload failed:', errorMessage, errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.success) {
      const errorMessage = result.error || 'Failed to upload file';
      console.error('Upload failed:', errorMessage, result);
      throw new Error(errorMessage);
    }

    // Ensure URL is correct - if it's a relative path starting with /uploads/, it's correct
    // Backend returns URL like /uploads/filename.jpg
    if (result.data?.url) {
      // Log for debugging
      if (import.meta.env.DEV) {
        console.log('✅ File uploaded successfully:', {
          url: result.data.url,
          filename: result.data.filename,
          size: result.data.size,
        });
      }
    }

    return result;
  }
}

export const mediaService = new MediaService();
