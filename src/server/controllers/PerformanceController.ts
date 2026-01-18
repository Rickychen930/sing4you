import { Request, Response } from 'express';
import { PerformanceService } from '../services/PerformanceService';

export class PerformanceController {
  private performanceService: PerformanceService;

  constructor() {
    this.performanceService = new PerformanceService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const performances = await this.performanceService.getAll();
      res.json({ success: true, data: performances });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getUpcoming = async (req: Request, res: Response): Promise<void> => {
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
      const performance = await this.performanceService.getById(req.params.id);
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
      const performance = await this.performanceService.update(req.params.id, req.body);
      res.json({ success: true, data: performance });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.performanceService.delete(req.params.id);
      res.json({ success: true, message: 'Performance deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}