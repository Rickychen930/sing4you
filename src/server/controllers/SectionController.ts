import { Request, Response } from 'express';
import { SectionService } from '../services/SectionService';

export class SectionController {
  private sectionService: SectionService;

  constructor() {
    this.sectionService = new SectionService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const sections = await this.sectionService.getAll();
      res.json({ success: true, data: sections });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const section = await this.sectionService.getById(req.params.id);
      res.json({ success: true, data: section });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public getBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const section = await this.sectionService.getBySlug(req.params.slug);
      res.json({ success: true, data: section });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public getByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const sections = await this.sectionService.getByType(req.params.type);
      res.json({ success: true, data: sections });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const section = await this.sectionService.create(req.body);
      res.status(201).json({ success: true, data: section });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const section = await this.sectionService.update(req.params.id, req.body);
      res.json({ success: true, data: section });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.sectionService.delete(req.params.id);
      res.json({ success: true, message: 'Section deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}