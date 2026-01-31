import type { Request, Response, NextFunction } from 'express';
import { PerformanceService } from '../services/PerformanceService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class PerformanceController {
  private performanceService: PerformanceService;

  constructor() {
    this.performanceService = new PerformanceService();
  }

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performances = await this.performanceService.getAll();
      res.json({ success: true, data: performances });
    } catch (error) {
      next(error);
    }
  };

  public getPaginated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 9));
      const result = await this.performanceService.getPaginated(page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public getUpcoming = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performances = await this.performanceService.getUpcoming();
      res.json({ success: true, data: performances });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const performance = await this.performanceService.getById(id);
      res.json({ success: true, data: performance });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Performance not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performance = await this.performanceService.create(req.body);
      res.status(201).json({ success: true, data: performance });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const performance = await this.performanceService.update(id, req.body);
      res.json({ success: true, data: performance });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Performance not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      await this.performanceService.delete(id);
      res.json({ success: true, message: 'Performance deleted successfully' });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Performance not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };
}