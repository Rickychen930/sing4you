import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
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
      const category = await this.categoryService.getById(req.params.id);
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
      const category = await this.categoryService.update(req.params.id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.categoryService.delete(req.params.id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}
