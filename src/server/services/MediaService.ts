import { MediaModel } from '../models/MediaModel';
import { Database } from '../config/database';
import type { IMedia } from '../../shared/interfaces';

export class MediaService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<IMedia[]> {
    if (this.useMockData()) {
      return [];
    }
    return await MediaModel.findAll();
  }

  public async getById(id: string): Promise<IMedia> {
    if (this.useMockData()) {
      throw new Error('Media not found');
    }
    const media = await MediaModel.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }
    return media;
  }

  public async getByVariationId(variationId: string): Promise<IMedia[]> {
    if (this.useMockData()) {
      return [];
    }
    return await MediaModel.findByVariationId(variationId);
  }

  public async create(data: Partial<IMedia>): Promise<IMedia> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot create media.');
    }
    return await MediaModel.create(data);
  }

  public async update(id: string, data: Partial<IMedia>): Promise<IMedia> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot update media.');
    }
    const media = await MediaModel.update(id, data);
    if (!media) {
      throw new Error('Media not found');
    }
    return media;
  }

  public async delete(id: string): Promise<void> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot delete media.');
    }
    const deleted = await MediaModel.delete(id);
    if (!deleted) {
      throw new Error('Media not found');
    }
  }

  public async deleteByVariationId(variationId: string): Promise<void> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot delete media.');
    }
    await MediaModel.deleteByVariationId(variationId);
  }
}
