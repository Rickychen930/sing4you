import { apiClient } from './api';
import type { IFAQ } from '../../shared/interfaces';

export class FAQService {
  async getAll(activeOnly: boolean = true, useCache: boolean = true): Promise<IFAQ[]> {
    const query = activeOnly ? '?activeOnly=true' : '?activeOnly=false';
    return apiClient.get<IFAQ[]>(`/api/faq${query}`, useCache);
  }

  async getById(id: string): Promise<IFAQ> {
    return apiClient.get<IFAQ>(`/api/faq/${id}`);
  }

  async create(data: Partial<IFAQ>): Promise<IFAQ> {
    return apiClient.post<IFAQ>('/api/admin/faq', data);
  }

  async update(id: string, data: Partial<IFAQ>): Promise<IFAQ> {
    return apiClient.put<IFAQ>(`/api/admin/faq/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/faq/${id}`);
  }
}

export const faqService = new FAQService();
