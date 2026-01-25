import type { Request, Response, NextFunction } from 'express';
import { SectionService } from '../services/SectionService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class SectionController {
  private sectionService: SectionService;

  constructor() {
    this.sectionService = new SectionService();
  }

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sections = await this.sectionService.getAll();
      res.json({ success: true, data: sections });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const section = await this.sectionService.getById(id);
      res.json({ success: true, data: section });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Section not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = getRequiredStringParam(req, 'slug');
      const section = await this.sectionService.getBySlug(slug);
      res.json({ success: true, data: section });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Section not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public getByType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type = getRequiredStringParam(req, 'type');
      const sections = await this.sectionService.getByType(type);
      res.json({ success: true, data: sections });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const section = await this.sectionService.create(req.body);
      res.status(201).json({ success: true, data: section });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const section = await this.sectionService.update(id, req.body);
      res.json({ success: true, data: section });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Section not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      await this.sectionService.delete(id);
      res.json({ success: true, message: 'Section deleted successfully' });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Section not found') {
        res.status(404).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  };
}