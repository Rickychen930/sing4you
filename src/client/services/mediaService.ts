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

    const uploadUrl = API_BASE_URL 
      ? `${API_BASE_URL}/api/admin/media/upload`
      : '/api/admin/media/upload';
    
    let response: Response;
    try {
      response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
        body: formData,
      });
    } catch {
      // Handle connection refused error
      const errorMessage = import.meta.env.DEV
        ? 'Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:3001'
        : 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload file');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload file');
    }

    return result;
  }
}

export const mediaService = new MediaService();
