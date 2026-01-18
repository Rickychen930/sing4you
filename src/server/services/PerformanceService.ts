import { PerformanceModel } from '../models/PerformanceModel';
import { Database } from '../config/database';
import { MockDataService } from './MockDataService';
import type { IPerformance } from '../../shared/interfaces';

export class PerformanceService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<IPerformance[]> {
    if (this.useMockData()) {
      return MockDataService.getAllPerformances();
    }
    return await PerformanceModel.findAll();
  }

  public async getUpcoming(): Promise<IPerformance[]> {
    if (this.useMockData()) {
      return MockDataService.getUpcomingPerformances();
    }
    return await PerformanceModel.findUpcoming();
  }

  public async getById(id: string): Promise<IPerformance> {
    if (this.useMockData()) {
      const performance = MockDataService.getPerformanceById(id);
      if (!performance) throw new Error('Performance not found');
      return performance;
    }
    const performance = await PerformanceModel.findById(id);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return performance;
  }

  public async create(data: Partial<IPerformance>): Promise<IPerformance> {
    if (this.useMockData()) {
      return MockDataService.createPerformance(data);
    }
    return await PerformanceModel.create(data);
  }

  public async update(id: string, data: Partial<IPerformance>): Promise<IPerformance> {
    if (this.useMockData()) {
      const performance = MockDataService.updatePerformance(id, data);
      if (!performance) throw new Error('Performance not found');
      return performance;
    }
    const performance = await PerformanceModel.update(id, data);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return performance;
  }

  public async delete(id: string): Promise<void> {
    if (this.useMockData()) {
      const deleted = MockDataService.deletePerformance(id);
      if (!deleted) throw new Error('Performance not found');
      return;
    }
    const deleted = await PerformanceModel.delete(id);
    if (!deleted) {
      throw new Error('Performance not found');
    }
  }
}