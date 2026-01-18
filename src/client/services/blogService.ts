import { apiClient } from './api';
import type { IBlogPost } from '../../shared/interfaces';

export class BlogService {
  async getPublished(): Promise<IBlogPost[]> {
    return apiClient.get<IBlogPost[]>('/api/blog');
  }

  async getAll(): Promise<IBlogPost[]> {
    return apiClient.get<IBlogPost[]>('/api/admin/blog');
  }

  async getById(id: string): Promise<IBlogPost> {
    return apiClient.get<IBlogPost>(`/api/blog/${id}`);
  }

  async getBySlug(slug: string): Promise<IBlogPost> {
    return apiClient.get<IBlogPost>(`/api/blog/slug/${slug}`);
  }

  async create(data: Partial<IBlogPost>): Promise<IBlogPost> {
    return apiClient.post<IBlogPost>('/api/admin/blog', data);
  }

  async update(id: string, data: Partial<IBlogPost>): Promise<IBlogPost> {
    return apiClient.put<IBlogPost>(`/api/admin/blog/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/blog/${id}`);
  }
}

export const blogService = new BlogService();