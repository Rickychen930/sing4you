import type { Request, Response } from 'express';
import { TestimonialService } from '../services/TestimonialService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class TestimonialController {
  private testimonialService: TestimonialService;

  constructor() {
    this.testimonialService = new TestimonialService();
  }

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const testimonials = await this.testimonialService.getAll();
      res.json({ success: true, data: testimonials });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const testimonial = await this.testimonialService.getById(id);
      res.json({ success: true, data: testimonial });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const testimonial = await this.testimonialService.create(req.body);
      res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const testimonial = await this.testimonialService.update(id, req.body);
      res.json({ success: true, data: testimonial });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      await this.testimonialService.delete(id);
      res.json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}