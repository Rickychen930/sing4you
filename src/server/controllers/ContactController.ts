import type { Request, Response, NextFunction } from 'express';
import type { IContactForm } from '../../shared/interfaces';
import { sanitizeObject } from '../utils/sanitize';
import { EmailService } from '../services/EmailService';

export class ContactController {
  public submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Sanitize input to prevent XSS
      const formData: IContactForm = sanitizeObject(req.body);

      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        res.status(400).json({
          success: false,
          error: 'Name, email, and message are required fields.',
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        res.status(400).json({
          success: false,
          error: 'Please provide a valid email address.',
        });
        return;
      }

      // Send email notification (non-blocking - won't fail the request if email fails)
      EmailService.sendContactNotification(formData).catch((error) => {
        console.error('Email notification error (non-blocking):', error);
      });

      res.json({
        success: true,
        message: 'Thank you for your inquiry. We will get back to you soon.',
      });
    } catch (error) {
      next(error);
    }
  };
}