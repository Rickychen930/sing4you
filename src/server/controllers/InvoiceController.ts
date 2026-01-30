import type { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/InvoiceService';
import { getRequiredStringParam } from '../utils/requestHelpers';
import type { IInvoice } from '../../shared/interfaces';

/** Normalize date fields from JSON (ISO string) to Date so DB and frontend stay in sync. */
function normalizeInvoiceDates(body: Partial<IInvoice> & { issueDate?: string | Date; dueDate?: string | Date }): Partial<IInvoice> {
  const out = { ...body };
  if (typeof out.issueDate === 'string') out.issueDate = new Date(out.issueDate);
  if (out.dueDate != null && typeof out.dueDate === 'string') out.dueDate = new Date(out.dueDate);
  return out;
}

export class InvoiceController {
  private invoiceService = new InvoiceService();

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invoices = await this.invoiceService.getAll();
      res.json({ success: true, data: invoices });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const invoice = await this.invoiceService.getById(id);
      if (!invoice) {
        res.status(404).json({ success: false, error: 'Invoice not found' });
        return;
      }
      res.json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  public getByClientId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientId = getRequiredStringParam(req, 'clientId');
      const invoices = await this.invoiceService.getByClientId(clientId);
      res.json({ success: true, data: invoices });
    } catch (error) {
      next(error);
    }
  };

  public getNextNumber = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const number = await this.invoiceService.getNextInvoiceNumber();
      res.json({ success: true, data: { invoiceNumber: number } });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = normalizeInvoiceDates(req.body);
      const invoice = await this.invoiceService.create(body);
      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const body = normalizeInvoiceDates(req.body);
      const invoice = await this.invoiceService.update(id, body);
      if (!invoice) {
        res.status(404).json({ success: false, error: 'Invoice not found' });
        return;
      }
      res.json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const deleted = await this.invoiceService.delete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Invoice not found' });
        return;
      }
      res.json({ success: true, message: 'Invoice deleted' });
    } catch (error) {
      next(error);
    }
  };
}
