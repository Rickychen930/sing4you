import { HeroSettingsModel } from '../models/HeroSettingsModel';
import { Database } from '../config/database';
import { MockDataService } from './MockDataService';
import type { IHeroSettings } from '../../shared/interfaces';

export class HeroService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getSettings(): Promise<IHeroSettings> {
    if (this.useMockData()) {
      return MockDataService.getHeroSettings();
    }

    const settings = await HeroSettingsModel.getSettings();
    if (!settings) {
      // Fallback to mock data if not found in database
      return MockDataService.getHeroSettings();
    }
    return settings;
  }

  public async updateSettings(data: Partial<IHeroSettings>): Promise<IHeroSettings> {
    if (this.useMockData()) {
      return MockDataService.updateHeroSettings(data);
    }

    return await HeroSettingsModel.updateSettings(data);
  }
}