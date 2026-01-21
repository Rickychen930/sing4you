import type { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const category = await this.categoryService.getById(id);
      res.json({ success: true, data: category });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const category = await this.categoryService.update(id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      await this.categoryService.delete(id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}
