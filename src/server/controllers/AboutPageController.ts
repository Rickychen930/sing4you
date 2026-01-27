import type { Request, Response, NextFunction } from 'express';
import { AboutPageService } from '../services/AboutPageService';

export class AboutPageController {
  private aboutPageService: AboutPageService;

  constructor() {
    this.aboutPageService = new AboutPageService();
  }

  public getSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.aboutPageService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.aboutPageService.updateSettings(req.body);
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };
}
