import { apiClient } from './api';
import type { IPerformance, IPerformancePaginated } from '../../shared/interfaces';

export class PerformanceService {
  async getAll(useCache: boolean = true): Promise<IPerformance[]> {
    return apiClient.get<IPerformance[]>('/api/performances', useCache);
  }

  async getPaginated(page: number = 1, limit: number = 9, useCache: boolean = false): Promise<IPerformancePaginated> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiClient.get<IPerformancePaginated>(`/api/performances/paginated?${params}`, useCache);
  }

  async getUpcoming(): Promise<IPerformance[]> {
    return apiClient.get<IPerformance[]>('/api/performances/upcoming', false);
  }

  async getById(id: string): Promise<IPerformance> {
    return apiClient.get<IPerformance>(`/api/performances/${id}`);
  }

  async create(data: Partial<IPerformance>): Promise<IPerformance> {
    return apiClient.post<IPerformance>('/api/admin/performances', data);
  }

  async update(id: string, data: Partial<IPerformance>): Promise<IPerformance> {
    return apiClient.put<IPerformance>(`/api/admin/performances/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/performances/${id}`);
  }
}

export const performanceService = new PerformanceService();