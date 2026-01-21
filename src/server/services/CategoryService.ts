import { CategoryModel } from '../models/CategoryModel';
import { Database } from '../config/database';
import type { ICategory } from '../../shared/interfaces';

export class CategoryService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  private getMockCategories(): ICategory[] {
    return [
      {
        _id: 'mock-category-1',
        name: 'Solo Performances',
        description: 'Experience the power and beauty of a single voice. Perfect for intimate gatherings, cocktail parties, and small events.',
        order: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        _id: 'mock-category-2',
        name: 'Duo Performances',
        description: 'Harmonious duets that bring magic to your event. Two voices creating unforgettable moments.',
        order: 2,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        _id: 'mock-category-3',
        name: 'Wedding Ceremonies',
        description: 'Make your special day unforgettable with beautiful wedding songs. From ceremony to reception, I\'ll help create magical moments.',
        order: 3,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        _id: 'mock-category-4',
        name: 'Corporate Events',
        description: 'Professional performances for corporate gatherings, product launches, and business events.',
        order: 4,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        _id: 'mock-category-5',
        name: 'PocketRocker',
        description: 'Compact and powerful performances perfect for smaller venues and intimate settings.',
        order: 5,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
    ];
  }

  public async getAll(): Promise<ICategory[]> {
    if (this.useMockData()) {
      return this.getMockCategories();
    }
    return await CategoryModel.findAll();
  }

  public async getById(id: string): Promise<ICategory> {
    if (this.useMockData()) {
      const categories = this.getMockCategories();
      const category = categories.find(cat => cat._id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    }
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public async getByName(name: string): Promise<ICategory> {
    if (this.useMockData()) {
      const categories = this.getMockCategories();
      const category = categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
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
