import { Request, Response } from 'express';
import { TestimonialService } from '../services/TestimonialService';

export class TestimonialController {
  private testimonialService: TestimonialService;

  constructor() {
    this.testimonialService = new TestimonialService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
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
      const testimonial = await this.testimonialService.getById(req.params.id);
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
      const testimonial = await this.testimonialService.update(req.params.id, req.body);
      res.json({ success: true, data: testimonial });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.testimonialService.delete(req.params.id);
      res.json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}