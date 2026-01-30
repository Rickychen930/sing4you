import { ClientCommunicationModel } from '../models/ClientCommunicationModel';
import { Database } from '../config/database';
import type { IClientCommunication } from '../../shared/interfaces';

export class ClientCommunicationService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getByClientId(clientId: string): Promise<IClientCommunication[]> {
    if (this.useMockData()) return [];
    return ClientCommunicationModel.findByClientId(clientId);
  }

  public async getById(id: string): Promise<IClientCommunication | null> {
    if (this.useMockData()) return null;
    return ClientCommunicationModel.findById(id);
  }

  public async create(data: Partial<IClientCommunication>): Promise<IClientCommunication> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot create communication.');
    }
    return ClientCommunicationModel.create(data);
  }

  public async update(id: string, data: Partial<IClientCommunication>): Promise<IClientCommunication | null> {
    if (this.useMockData()) return null;
    return ClientCommunicationModel.update(id, data);
  }

  public async delete(id: string): Promise<boolean> {
    if (this.useMockData()) return false;
    return ClientCommunicationModel.delete(id);
  }
}
