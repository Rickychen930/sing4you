import type { Request, Response } from 'express';
import { PerformanceService } from '../services/PerformanceService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class PerformanceController {
  private performanceService: PerformanceService;

  constructor() {
    this.performanceService = new PerformanceService();
  }

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const performances = await this.performanceService.getAll();
      res.json({ success: true, data: performances });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getUpcoming = async (_req: Request, res: Response): Promise<void> => {
    try {
      const performances = await this.performanceService.getUpcoming();
      res.json({ success: true, data: performances });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const performance = await this.performanceService.getById(id);
      res.json({ success: true, data: performance });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const performance = await this.performanceService.create(req.body);
      res.status(201).json({ success: true, data: performance });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const performance = await this.performanceService.update(id, req.body);
      res.json({ success: true, data: performance });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      await this.performanceService.delete(id);
      res.json({ success: true, message: 'Performance deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}