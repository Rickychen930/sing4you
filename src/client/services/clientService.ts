import { apiClient } from './api';
import type { IClient } from '../../shared/interfaces';

export class ClientService {
  async getAll(): Promise<IClient[]> {
    return apiClient.get<IClient[]>('/api/admin/clients', false);
  }

  async getById(id: string): Promise<IClient> {
    return apiClient.get<IClient>(`/api/admin/clients/${id}`);
  }

  async create(data: Partial<IClient>): Promise<IClient> {
    return apiClient.post<IClient>('/api/admin/clients', data);
  }

  async update(id: string, data: Partial<IClient>): Promise<IClient> {
    return apiClient.put<IClient>(`/api/admin/clients/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/clients/${id}`);
  }
}

export const clientService = new ClientService();
