import { VariationModel } from '../models/VariationModel';
import { Database } from '../config/database';
import type { IVariation } from '../../shared/interfaces';

export class VariationService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  private getMockVariations(): IVariation[] {
    return [
      {
        _id: 'mock-variation-1',
        categoryId: 'mock-category-1',
        name: 'Acoustic Solo',
        shortDescription: 'Intimate acoustic performances with just voice and guitar',
        longDescription: 'Experience the raw beauty of acoustic solo performances. Perfect for intimate gatherings, romantic dinners, and small events where you want to create a warm, personal atmosphere. Christina brings her powerful voice and acoustic guitar to create unforgettable moments.',
        slug: 'acoustic-solo',
        order: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        _id: 'mock-variation-2',
        categoryId: 'mock-category-1',
        name: 'Jazz Solo',
        shortDescription: 'Smooth jazz vocals with piano accompaniment',
        longDescription: 'Dive into the world of jazz with smooth, sultry vocals accompanied by piano. Perfect for sophisticated events, cocktail parties, and elegant soirées. Christina\'s jazz repertoire includes classics from Ella Fitzgerald, Billie Holiday, and modern jazz standards.',
        slug: 'jazz-solo',
        order: 2,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        _id: 'mock-variation-3',
        categoryId: 'mock-category-1',
        name: 'Pop & Contemporary Solo',
        shortDescription: 'Modern hits and contemporary favorites',
        longDescription: 'From Adele to Ed Sheeran, Christina performs your favorite pop and contemporary hits with her unique style. Perfect for parties, celebrations, and events where you want familiar, crowd-pleasing songs that get everyone singing along.',
        slug: 'pop-contemporary-solo',
        order: 3,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        _id: 'mock-variation-4',
        categoryId: 'mock-category-2',
        name: 'Classic Duo',
        shortDescription: 'Harmonious duets with piano accompaniment',
        longDescription: 'Beautiful harmonies created by two voices with piano accompaniment. Perfect for weddings, anniversaries, and romantic occasions. The classic duo brings elegance and sophistication to any event.',
        slug: 'classic-duo',
        order: 1,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        _id: 'mock-variation-5',
        categoryId: 'mock-category-2',
        name: 'Acoustic Duo',
        shortDescription: 'Two voices, two guitars, beautiful harmonies',
        longDescription: 'Intimate acoustic duo performances featuring two voices and acoustic guitars. Perfect for outdoor events, garden parties, and casual celebrations. The acoustic duo creates a relaxed, warm atmosphere that guests will love.',
        slug: 'acoustic-duo',
        order: 2,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        _id: 'mock-variation-6',
        categoryId: 'mock-category-3',
        name: 'Wedding Ceremony',
        shortDescription: 'Beautiful music for your wedding ceremony',
        longDescription: 'Make your wedding ceremony unforgettable with beautiful live music. From the processional to the recessional, Christina will perform songs that reflect your love story. Custom song selections available to make your ceremony truly personal.',
        slug: 'wedding-ceremony',
        order: 1,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      },
      {
        _id: 'mock-variation-7',
        categoryId: 'mock-category-3',
        name: 'Wedding Reception',
        shortDescription: 'Energetic performances for your wedding reception',
        longDescription: 'Keep the celebration going with energetic performances during your wedding reception. From first dance songs to party favorites, Christina will keep your guests entertained and on the dance floor all night long.',
        slug: 'wedding-reception',
        order: 2,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      },
      {
        _id: 'mock-variation-8',
        categoryId: 'mock-category-3',
        name: 'Full Wedding Package',
        shortDescription: 'Complete wedding music from ceremony to reception',
        longDescription: 'The complete wedding experience! This package includes music for both your ceremony and reception, ensuring a seamless musical experience throughout your entire wedding day. Perfect for couples who want everything taken care of.',
        slug: 'full-wedding-package',
        order: 3,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        _id: 'mock-variation-9',
        categoryId: 'mock-category-4',
        name: 'Corporate Gala',
        shortDescription: 'Elegant performances for corporate galas and dinners',
        longDescription: 'Add sophistication to your corporate gala or dinner with elegant live music. Perfect for awards nights, annual dinners, and formal corporate events. Christina will create the perfect ambiance for networking and celebration.',
        slug: 'corporate-gala',
        order: 1,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      },
      {
        _id: 'mock-variation-10',
        categoryId: 'mock-category-4',
        name: 'Product Launch',
        shortDescription: 'Dynamic performances for product launches',
        longDescription: 'Make your product launch memorable with dynamic live performances. Perfect for creating excitement and energy at your launch event. Christina can tailor her performance to match your brand and product theme.',
        slug: 'product-launch',
        order: 2,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        _id: 'mock-variation-11',
        categoryId: 'mock-category-5',
        name: 'PocketRocker Solo',
        shortDescription: 'Compact solo performance perfect for small venues',
        longDescription: 'The PocketRocker solo is perfect for smaller venues and intimate settings. Compact setup with professional sound quality, ideal for cafes, small restaurants, and intimate gatherings where space is limited but quality is essential.',
        slug: 'pocketrocker-solo',
        order: 1,
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
      },
      {
        _id: 'mock-variation-12',
        categoryId: 'mock-category-5',
        name: 'PocketRocker Duo',
        shortDescription: 'Compact duo performance with powerful sound',
        longDescription: 'Two voices, compact setup, powerful sound. The PocketRocker duo brings the beauty of harmonies to smaller venues without compromising on quality. Perfect for intimate events where you want professional performance in a compact format.',
        slug: 'pocketrocker-duo',
        order: 2,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
    ];
  }

  public async getAll(): Promise<IVariation[]> {
    if (this.useMockData()) {
      return this.getMockVariations();
    }
    return await VariationModel.findAll();
  }

  public async getById(id: string): Promise<IVariation> {
    if (this.useMockData()) {
      const variations = this.getMockVariations();
      const variation = variations.find(v => v._id === id);
      if (!variation) {
        throw new Error('Variation not found');
      }
      return variation;
    }
    const variation = await VariationModel.findById(id);
    if (!variation) {
      throw new Error('Variation not found');
    }
    return variation;
  }

  public async getByCategoryId(categoryId: string): Promise<IVariation[]> {
    if (this.useMockData()) {
      return this.getMockVariations().filter(v => v.categoryId === categoryId);
    }
    return await VariationModel.findByCategoryId(categoryId);
  }

  public async getBySlug(slug: string): Promise<IVariation> {
    if (this.useMockData()) {
      const variations = this.getMockVariations();
      const variation = variations.find(v => v.slug === slug);
      if (!variation) {
        throw new Error('Variation not found');
      }
      return variation;
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
