import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/CategoryService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const category = await this.categoryService.getById(id);
      res.json({ success: true, data: category });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Category not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const category = await this.categoryService.update(id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Category not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = getRequiredStringParam(req, 'slug');
      const category = await this.categoryService.getBySlug(slug);
      res.json({ success: true, data: category });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Category not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public getByType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type = getRequiredStringParam(req, 'type');
      const categories = await this.categoryService.getByType(type);
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      await this.categoryService.delete(id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Category not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };
}
