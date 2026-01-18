import { apiClient } from './api';
import type { ITestimonial } from '../../shared/interfaces';

export class TestimonialService {
  async getAll(): Promise<ITestimonial[]> {
    return apiClient.get<ITestimonial[]>('/api/testimonials');
  }

  async getById(id: string): Promise<ITestimonial> {
    return apiClient.get<ITestimonial>(`/api/testimonials/${id}`);
  }

  async create(data: Partial<ITestimonial>): Promise<ITestimonial> {
    return apiClient.post<ITestimonial>('/api/admin/testimonials', data);
  }

  async update(id: string, data: Partial<ITestimonial>): Promise<ITestimonial> {
    return apiClient.put<ITestimonial>(`/api/admin/testimonials/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/testimonials/${id}`);
  }
}

export const testimonialService = new TestimonialService();