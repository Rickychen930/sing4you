import { MediaModel } from '../models/MediaModel';
import { Database } from '../config/database';
import type { IMedia } from '../../shared/interfaces';

export class MediaService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  private getMockMedia(): IMedia[] {
    return [
      // Acoustic Solo
      {
        _id: 'mock-media-1',
        variationId: 'mock-variation-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        _id: 'mock-media-2',
        variationId: 'mock-variation-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        _id: 'mock-media-1a',
        variationId: 'mock-variation-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        _id: 'mock-media-1b',
        variationId: 'mock-variation-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        order: 4,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      // Jazz Solo
      {
        _id: 'mock-media-3',
        variationId: 'mock-variation-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        _id: 'mock-media-4',
        variationId: 'mock-variation-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        _id: 'mock-media-2a',
        variationId: 'mock-variation-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        _id: 'mock-media-2b',
        variationId: 'mock-variation-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        order: 4,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      // Pop & Contemporary Solo
      {
        _id: 'mock-media-5',
        variationId: 'mock-variation-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        _id: 'mock-media-6',
        variationId: 'mock-variation-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        _id: 'mock-media-3a',
        variationId: 'mock-variation-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        _id: 'mock-media-3b',
        variationId: 'mock-variation-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        order: 4,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      // Classic Duo
      {
        _id: 'mock-media-7',
        variationId: 'mock-variation-4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        _id: 'mock-media-8',
        variationId: 'mock-variation-4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        _id: 'mock-media-4a',
        variationId: 'mock-variation-4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        _id: 'mock-media-4b',
        variationId: 'mock-variation-4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
        order: 4,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      // Acoustic Duo
      {
        _id: 'mock-media-9',
        variationId: 'mock-variation-5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        _id: 'mock-media-5a',
        variationId: 'mock-variation-5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        _id: 'mock-media-5b',
        variationId: 'mock-variation-5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      // Wedding Ceremony
      {
        _id: 'mock-media-10',
        variationId: 'mock-variation-6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      },
      {
        _id: 'mock-media-11',
        variationId: 'mock-variation-6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      },
      {
        _id: 'mock-media-12',
        variationId: 'mock-variation-6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      },
      // Wedding Reception
      {
        _id: 'mock-media-13',
        variationId: 'mock-variation-7',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      },
      {
        _id: 'mock-media-14',
        variationId: 'mock-variation-7',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      },
      {
        _id: 'mock-media-7a',
        variationId: 'mock-variation-7',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      },
      {
        _id: 'mock-media-7b',
        variationId: 'mock-variation-7',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop',
        order: 4,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      },
      // Full Wedding Package
      {
        _id: 'mock-media-15',
        variationId: 'mock-variation-8',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        _id: 'mock-media-16',
        variationId: 'mock-variation-8',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        _id: 'mock-media-8a',
        variationId: 'mock-variation-8',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        _id: 'mock-media-8b',
        variationId: 'mock-variation-8',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        order: 4,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        _id: 'mock-media-8c',
        variationId: 'mock-variation-8',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
        order: 5,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      // Corporate Gala
      {
        _id: 'mock-media-17',
        variationId: 'mock-variation-9',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      },
      {
        _id: 'mock-media-18',
        variationId: 'mock-variation-9',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      },
      {
        _id: 'mock-media-9a',
        variationId: 'mock-variation-9',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      },
      {
        _id: 'mock-media-9b',
        variationId: 'mock-variation-9',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        order: 4,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      },
      // Product Launch
      {
        _id: 'mock-media-19',
        variationId: 'mock-variation-10',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        _id: 'mock-media-10a',
        variationId: 'mock-variation-10',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        _id: 'mock-media-10b',
        variationId: 'mock-variation-10',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      // PocketRocker Solo
      {
        _id: 'mock-media-20',
        variationId: 'mock-variation-11',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
      },
      {
        _id: 'mock-media-11a',
        variationId: 'mock-variation-11',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
      },
      {
        _id: 'mock-media-11b',
        variationId: 'mock-variation-11',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
      },
      // PocketRocker Duo
      {
        _id: 'mock-media-21',
        variationId: 'mock-variation-12',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        order: 1,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        _id: 'mock-media-12a',
        variationId: 'mock-variation-12',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        order: 2,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        _id: 'mock-media-12b',
        variationId: 'mock-variation-12',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
        order: 3,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
    ];
  }

  public async getAll(): Promise<IMedia[]> {
    if (this.useMockData()) {
      return this.getMockMedia();
    }
    return await MediaModel.findAll();
  }

  public async getById(id: string): Promise<IMedia> {
    if (this.useMockData()) {
      const media = this.getMockMedia();
      const mediaItem = media.find(m => m._id === id);
      if (!mediaItem) {
        throw new Error('Media not found');
      }
      return mediaItem;
    }
    const media = await MediaModel.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }
    return media;
  }

  public async getByVariationId(variationId: string): Promise<IMedia[]> {
    if (this.useMockData()) {
      return this.getMockMedia()
        .filter(m => m.variationId === variationId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
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
