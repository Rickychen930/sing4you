import { apiClient } from './api';
import type { IMedia } from '../../shared/interfaces';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

    const response = await fetch(`${API_BASE_URL}/api/admin/media/upload`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
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
