import type { Request, Response } from 'express';
import { SitemapGenerator } from '../utils/sitemap';

export class SitemapController {
  public generate = async (_req: Request, res: Response): Promise<void> => {
    try {
      const xml = await SitemapGenerator.generate();
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };
}