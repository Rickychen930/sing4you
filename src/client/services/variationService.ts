import { apiClient } from './api';
import type { IVariation } from '../../shared/interfaces';

export class VariationService {
  async getAll(useCache: boolean = true): Promise<IVariation[]> {
    return apiClient.get<IVariation[]>('/api/variations', useCache);
  }

  async getById(id: string): Promise<IVariation> {
    return apiClient.get<IVariation>(`/api/variations/${id}`);
  }

  async getByCategoryId(categoryId: string): Promise<IVariation[]> {
    return apiClient.get<IVariation[]>(`/api/categories/${categoryId}/variations`);
  }

  async getBySlug(slug: string): Promise<IVariation> {
    return apiClient.get<IVariation>(`/api/variations/slug/${slug}`);
  }

  async create(data: Partial<IVariation>): Promise<IVariation> {
    return apiClient.post<IVariation>('/api/admin/variations', data);
  }

  async update(id: string, data: Partial<IVariation>): Promise<IVariation> {
    return apiClient.put<IVariation>(`/api/admin/variations/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/variations/${id}`);
  }
}

export const variationService = new VariationService();
