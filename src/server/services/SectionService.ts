import { SectionModel } from '../models/SectionModel';
import { Database } from '../config/database';
import { MockDataService } from './MockDataService';
import type { ISection } from '../../shared/interfaces';

export class SectionService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<ISection[]> {
    if (this.useMockData()) {
      return MockDataService.getAllSections();
    }
    return await SectionModel.findAll();
  }

  public async getById(id: string): Promise<ISection> {
    if (this.useMockData()) {
      const section = MockDataService.getSectionById(id);
      if (!section) throw new Error('Section not found');
      return section;
    }
    const section = await SectionModel.findById(id);
    if (!section) {
      throw new Error('Section not found');
    }
    return section;
  }

  public async getBySlug(slug: string): Promise<ISection> {
    if (this.useMockData()) {
      const section = MockDataService.getSectionBySlug(slug);
      if (!section) throw new Error('Section not found');
      return section;
    }
    const section = await SectionModel.findBySlug(slug);
    if (!section) {
      throw new Error('Section not found');
    }
    return section;
  }

  public async getByType(type: string): Promise<ISection[]> {
    if (this.useMockData()) {
      return MockDataService.getSectionsByType(type);
    }
    return await SectionModel.findByType(type);
  }

  public async create(data: Partial<ISection>): Promise<ISection> {
    if (this.useMockData()) {
      return MockDataService.createSection(data);
    }
    return await SectionModel.create(data);
  }

  public async update(id: string, data: Partial<ISection>): Promise<ISection> {
    if (this.useMockData()) {
      const section = MockDataService.updateSection(id, data);
      if (!section) throw new Error('Section not found');
      return section;
    }
    const section = await SectionModel.update(id, data);
    if (!section) {
      throw new Error('Section not found');
    }
    return section;
  }

  public async delete(id: string): Promise<void> {
    if (this.useMockData()) {
      const deleted = MockDataService.deleteSection(id);
      if (!deleted) throw new Error('Section not found');
      return;
    }
    const deleted = await SectionModel.delete(id);
    if (!deleted) {
      throw new Error('Section not found');
    }
  }
}