import { Request, Response } from 'express';
import { VariationService } from '../services/VariationService';

export class VariationController {
  private variationService: VariationService;

  constructor() {
    this.variationService = new VariationService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const variations = await this.variationService.getAll();
      res.json({ success: true, data: variations });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const variation = await this.variationService.getById(req.params.id);
      res.json({ success: true, data: variation });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public getByCategoryId = async (req: Request, res: Response): Promise<void> => {
    try {
      const variations = await this.variationService.getByCategoryId(req.params.categoryId);
      res.json({ success: true, data: variations });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const variation = await this.variationService.getBySlug(req.params.slug);
      res.json({ success: true, data: variation });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const variation = await this.variationService.create(req.body);
      res.status(201).json({ success: true, data: variation });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const variation = await this.variationService.update(req.params.id, req.body);
      res.json({ success: true, data: variation });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.variationService.delete(req.params.id);
      res.json({ success: true, message: 'Variation deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}
