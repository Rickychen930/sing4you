import { TestimonialModel } from '../models/TestimonialModel';
import { Database } from '../config/database';
import { MockDataService } from './MockDataService';
import type { ITestimonial } from '../../shared/interfaces';

export class TestimonialService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<ITestimonial[]> {
    if (this.useMockData()) {
      return MockDataService.getAllTestimonials();
    }
    return await TestimonialModel.findAll();
  }

  public async getById(id: string): Promise<ITestimonial> {
    if (this.useMockData()) {
      const testimonial = MockDataService.getTestimonialById(id);
      if (!testimonial) throw new Error('Testimonial not found');
      return testimonial;
    }
    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    return testimonial;
  }

  public async create(data: Partial<ITestimonial>): Promise<ITestimonial> {
    if (this.useMockData()) {
      return MockDataService.createTestimonial(data);
    }
    return await TestimonialModel.create(data);
  }

  public async update(id: string, data: Partial<ITestimonial>): Promise<ITestimonial> {
    if (this.useMockData()) {
      const testimonial = MockDataService.updateTestimonial(id, data);
      if (!testimonial) throw new Error('Testimonial not found');
      return testimonial;
    }
    const testimonial = await TestimonialModel.update(id, data);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    return testimonial;
  }

  public async delete(id: string): Promise<void> {
    if (this.useMockData()) {
      const deleted = MockDataService.deleteTestimonial(id);
      if (!deleted) throw new Error('Testimonial not found');
      return;
    }
    const deleted = await TestimonialModel.delete(id);
    if (!deleted) {
      throw new Error('Testimonial not found');
    }
  }
}