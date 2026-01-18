import { apiClient } from './api';
import type { ISection } from '../../shared/interfaces';

export class SectionService {
  async getAll(): Promise<ISection[]> {
    return apiClient.get<ISection[]>('/api/sections');
  }

  async getById(id: string): Promise<ISection> {
    return apiClient.get<ISection>(`/api/sections/${id}`);
  }

  async getBySlug(slug: string): Promise<ISection> {
    return apiClient.get<ISection>(`/api/sections/slug/${slug}`);
  }

  async getByType(type: string): Promise<ISection[]> {
    return apiClient.get<ISection[]>(`/api/sections/type/${type}`);
  }

  async create(data: Partial<ISection>): Promise<ISection> {
    return apiClient.post<ISection>('/api/admin/sections', data);
  }

  async update(id: string, data: Partial<ISection>): Promise<ISection> {
    return apiClient.put<ISection>(`/api/admin/sections/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/sections/${id}`);
  }
}

export const sectionService = new SectionService();