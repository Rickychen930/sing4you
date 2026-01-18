import { apiClient } from './api';
import type { IPerformance } from '../../shared/interfaces';

export class PerformanceService {
  async getAll(): Promise<IPerformance[]> {
    return apiClient.get<IPerformance[]>('/api/performances');
  }

  async getUpcoming(): Promise<IPerformance[]> {
    return apiClient.get<IPerformance[]>('/api/performances/upcoming');
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