import { apiClient } from './api';
import type { IAboutPageSettings } from '../../shared/interfaces';

export class AboutPageService {
  async getSettings(useCache: boolean = true): Promise<IAboutPageSettings> {
    return apiClient.get<IAboutPageSettings>('/api/about', useCache);
  }

  async updateSettings(data: Partial<IAboutPageSettings>): Promise<IAboutPageSettings> {
    return apiClient.put<IAboutPageSettings>('/api/admin/about', data);
  }
}

export const aboutPageService = new AboutPageService();
