import type { Request, Response } from 'express';
import { SEOService } from '../services/SEOService';

export class SEOController {
  private seoService: SEOService;

  constructor() {
    this.seoService = new SEOService();
  }

  public getSettings = async (_req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.seoService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.seoService.updateSettings(req.body);
      res.json({ success: true, data: settings });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };
}