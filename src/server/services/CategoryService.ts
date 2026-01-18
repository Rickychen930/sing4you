import { CategoryModel } from '../models/CategoryModel';
import { Database } from '../config/database';
import type { ICategory } from '../../shared/interfaces';

export class CategoryService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<ICategory[]> {
    if (this.useMockData()) {
      return [];
    }
    return await CategoryModel.findAll();
  }

  public async getById(id: string): Promise<ICategory> {
    if (this.useMockData()) {
      throw new Error('Category not found');
    }
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public async getByName(name: string): Promise<ICategory> {
    if (this.useMockData()) {
      throw new Error('Category not found');
    }
    const category = await CategoryModel.findByName(name);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public async create(data: Partial<ICategory>): Promise<ICategory> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot create category.');
    }
    return await CategoryModel.create(data);
  }

  public async update(id: string, data: Partial<ICategory>): Promise<ICategory> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot update category.');
    }
    const category = await CategoryModel.update(id, data);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public async delete(id: string): Promise<void> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot delete category.');
    }
    const deleted = await CategoryModel.delete(id);
    if (!deleted) {
      throw new Error('Category not found');
    }
  }
}
