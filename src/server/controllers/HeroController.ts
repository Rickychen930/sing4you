import type { Request, Response, NextFunction } from 'express';
import { HeroService } from '../services/HeroService';

export class HeroController {
  private heroService: HeroService;

  constructor() {
    this.heroService = new HeroService();
  }

  public getSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.heroService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.heroService.updateSettings(req.body);
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };
}