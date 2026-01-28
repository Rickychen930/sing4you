import type { Request, Response, NextFunction } from 'express';
import { faqService } from '../services/FAQService';
import type { IFAQ } from '../../shared/interfaces';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class FAQController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeOnly = req.query.activeOnly !== 'false';
      const faqs = await faqService.getAll(activeOnly);
      res.json({ success: true, data: faqs });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getRequiredStringParam(req, 'id');
      const faq = await faqService.getById(id);
      if (!faq) {
        res.status(404).json({ success: false, error: 'FAQ not found' });
        return;
      }
      res.json({ success: true, data: faq });
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('required')) {
        res.status(400).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as Partial<IFAQ>;
      const faq = await faqService.create(data);
      res.status(201).json({ success: true, data: faq });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getRequiredStringParam(req, 'id');
      const data = req.body as Partial<IFAQ>;
      const faq = await faqService.update(id, data);
      if (!faq) {
        res.status(404).json({ success: false, error: 'FAQ not found' });
        return;
      }
      res.json({ success: true, data: faq });
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('required')) {
        res.status(400).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getRequiredStringParam(req, 'id');
      const deleted = await faqService.delete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'FAQ not found' });
        return;
      }
      res.json({ success: true, message: 'FAQ deleted successfully' });
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('required')) {
        res.status(400).json({ success: false, error: err.message });
      } else {
        next(error);
      }
    }
  }
}

export const faqController = new FAQController();
