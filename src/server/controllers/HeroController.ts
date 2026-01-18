import { Request, Response } from 'express';
import { HeroService } from '../services/HeroService';

export class HeroController {
  private heroService: HeroService;

  constructor() {
    this.heroService = new HeroService();
  }

  public getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.heroService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.heroService.updateSettings(req.body);
      res.json({ success: true, data: settings });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };
}