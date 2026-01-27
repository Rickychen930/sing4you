import { apiClient } from './api';
import type { ICategory } from '../../shared/interfaces';

export class CategoryService {
  async getAll(): Promise<ICategory[]> {
    return apiClient.get<ICategory[]>('/api/categories');
  }

  async getById(id: string): Promise<ICategory> {
    return apiClient.get<ICategory>(`/api/categories/${id}`);
  }

  async getBySlug(slug: string): Promise<ICategory> {
    return apiClient.get<ICategory>(`/api/categories/slug/${slug}`);
  }

  async getByType(type: string): Promise<ICategory[]> {
    return apiClient.get<ICategory[]>(`/api/categories/type/${type}`);
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    return apiClient.post<ICategory>('/api/admin/categories', data);
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory> {
    return apiClient.put<ICategory>(`/api/admin/categories/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
