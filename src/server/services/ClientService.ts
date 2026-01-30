import { ClientModel } from '../models/ClientModel';
import { ClientCommunicationModel } from '../models/ClientCommunicationModel';
import { Database } from '../config/database';
import type { IClient } from '../../shared/interfaces';

export class ClientService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<IClient[]> {
    if (this.useMockData()) return [];
    return ClientModel.findAll();
  }

  public async getById(id: string): Promise<IClient | null> {
    if (this.useMockData()) return null;
    return ClientModel.findById(id);
  }

  public async create(data: Partial<IClient>): Promise<IClient> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot create client.');
    }
    return ClientModel.create(data);
  }

  public async update(id: string, data: Partial<IClient>): Promise<IClient | null> {
    if (this.useMockData()) return null;
    return ClientModel.update(id, data);
  }

  public async delete(id: string): Promise<boolean> {
    if (this.useMockData()) return false;
    // Cascade: delete all communications for this client first
    await ClientCommunicationModel.deleteByClientId(id);
    return ClientModel.delete(id);
  }
}
