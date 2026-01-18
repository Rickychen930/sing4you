import { SEOSettingsModel } from '../models/SEOSettingsModel';
import { Database } from '../config/database';
import { MockDataService } from './MockDataService';
import type { ISEOSettings } from '../../shared/interfaces';

export class SEOService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getSettings(): Promise<ISEOSettings> {
    if (this.useMockData()) {
      return MockDataService.getSEOSettings();
    }
    const settings = await SEOSettingsModel.getSettings();
    if (!settings) {
      // Fallback to mock data if not found in database
      return MockDataService.getSEOSettings();
    }
    return settings;
  }

  public async updateSettings(data: Partial<ISEOSettings>): Promise<ISEOSettings> {
    if (this.useMockData()) {
      return MockDataService.updateSEOSettings(data);
    }
    return await SEOSettingsModel.updateSettings(data);
  }
}