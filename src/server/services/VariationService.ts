import { VariationModel } from '../models/VariationModel';
import { Database } from '../config/database';
import type { IVariation } from '../../shared/interfaces';

export class VariationService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<IVariation[]> {
    if (this.useMockData()) {
      return [];
    }
    return await VariationModel.findAll();
  }

  public async getById(id: string): Promise<IVariation> {
    if (this.useMockData()) {
      throw new Error('Variation not found');
    }
    const variation = await VariationModel.findById(id);
    if (!variation) {
      throw new Error('Variation not found');
    }
    return variation;
  }

  public async getByCategoryId(categoryId: string): Promise<IVariation[]> {
    if (this.useMockData()) {
      return [];
    }
    return await VariationModel.findByCategoryId(categoryId);
  }

  public async getBySlug(slug: string): Promise<IVariation> {
    if (this.useMockData()) {
      throw new Error('Variation not found');
    }
    const variation = await VariationModel.findBySlug(slug);
    if (!variation) {
      throw new Error('Variation not found');
    }
    return variation;
  }

  public async create(data: Partial<IVariation>): Promise<IVariation> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot create variation.');
    }
    return await VariationModel.create(data);
  }

  public async update(id: string, data: Partial<IVariation>): Promise<IVariation> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot update variation.');
    }
    const variation = await VariationModel.update(id, data);
    if (!variation) {
      throw new Error('Variation not found');
    }
    return variation;
  }

  public async delete(id: string): Promise<void> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot delete variation.');
    }
    const deleted = await VariationModel.delete(id);
    if (!deleted) {
      throw new Error('Variation not found');
    }
  }
}
