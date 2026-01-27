import { AboutPageSettingsModel } from '../models/AboutPageSettingsModel';
import { Database } from '../config/database';
import { MockDataService } from './MockDataService';
import type { IAboutPageSettings } from '../../shared/interfaces';

export class AboutPageService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getSettings(): Promise<IAboutPageSettings> {
    if (this.useMockData()) {
      return MockDataService.getAboutPageSettings();
    }

    const settings = await AboutPageSettingsModel.getSettings();
    if (!settings) {
      // Fallback to mock data if not found in database
      return MockDataService.getAboutPageSettings();
    }
    return settings;
  }

  public async updateSettings(data: Partial<IAboutPageSettings>): Promise<IAboutPageSettings> {
    if (this.useMockData()) {
      return MockDataService.updateAboutPageSettings(data);
    }

    return await AboutPageSettingsModel.updateSettings(data);
  }
}
