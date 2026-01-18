import { Request, Response } from 'express';
import { BlogService } from '../services/BlogService';

export class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await this.blogService.getAll();
      res.json({ success: true, data: posts });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getPublished = async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await this.blogService.getPublished();
      res.json({ success: true, data: posts });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.blogService.getById(req.params.id);
      res.json({ success: true, data: post });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public getBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.blogService.getBySlug(req.params.slug);
      res.json({ success: true, data: post });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.blogService.create(req.body);
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.blogService.update(req.params.id, req.body);
      res.json({ success: true, data: post });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.blogService.delete(req.params.id);
      res.json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}