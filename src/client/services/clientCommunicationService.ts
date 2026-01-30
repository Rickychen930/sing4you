import { apiClient } from './api';
import type { IClientCommunication } from '../../shared/interfaces';

export class ClientCommunicationService {
  async getByClientId(clientId: string): Promise<IClientCommunication[]> {
    return apiClient.get<IClientCommunication[]>(`/api/admin/clients/${clientId}/communications`, false);
  }

  async create(data: Partial<IClientCommunication>): Promise<IClientCommunication> {
    return apiClient.post<IClientCommunication>('/api/admin/communications', data);
  }

  async update(id: string, data: Partial<IClientCommunication>): Promise<IClientCommunication> {
    return apiClient.put<IClientCommunication>(`/api/admin/communications/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/communications/${id}`);
  }
}

export const clientCommunicationService = new ClientCommunicationService();
