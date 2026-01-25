import type { Request, Response, NextFunction } from 'express';
import { SitemapGenerator } from '../utils/sitemap';

export class SitemapController {
  public generate = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const xml = await SitemapGenerator.generate();
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      next(error);
    }
  };
}