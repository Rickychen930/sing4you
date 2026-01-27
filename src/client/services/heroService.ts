import { apiClient } from './api';
import type { IHeroSettings } from '../../shared/interfaces';

export class HeroService {
  async getSettings(useCache: boolean = true): Promise<IHeroSettings> {
    return apiClient.get<IHeroSettings>('/api/hero', useCache);
  }

  async updateSettings(data: Partial<IHeroSettings>): Promise<IHeroSettings> {
    return apiClient.put<IHeroSettings>('/api/admin/hero', data);
  }
}

export const heroService = new HeroService();