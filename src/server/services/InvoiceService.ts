import { InvoiceModel } from '../models/InvoiceModel';
import { Database } from '../config/database';
import type { IInvoice, IInvoiceLineItem } from '../../shared/interfaces';

function calculateTotals(items: IInvoiceLineItem[], gstRate: number = 0.1): { subtotal: number; gstAmount: number; total: number } {
  let subtotal = 0;
  for (const item of items) {
    const lineTotal = item.quantity * item.unitPrice;
    if (item.gstIncluded !== false) {
      subtotal += lineTotal / (1 + gstRate);
    } else {
      subtotal += lineTotal;
    }
  }
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;
  return { subtotal: Math.round(subtotal * 100) / 100, gstAmount: Math.round(gstAmount * 100) / 100, total: Math.round(total * 100) / 100 };
}

export class InvoiceService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<IInvoice[]> {
    if (this.useMockData()) return [];
    return InvoiceModel.findAll();
  }

  public async getById(id: string): Promise<IInvoice | null> {
    if (this.useMockData()) return null;
    return InvoiceModel.findById(id);
  }

  public async getByClientId(clientId: string): Promise<IInvoice[]> {
    if (this.useMockData()) return [];
    return InvoiceModel.findByClientId(clientId);
  }

  public async getNextInvoiceNumber(): Promise<string> {
    if (this.useMockData()) {
      const y = new Date().getFullYear();
      return `INV-${y}-1001`;
    }
    return InvoiceModel.getNextInvoiceNumber();
  }

  public async create(data: Partial<IInvoice>): Promise<IInvoice> {
    if (this.useMockData()) {
      throw new Error('Database not connected. Cannot create invoice.');
    }
    const gstRate = data.gstRate ?? 0.1;
    const items = data.items ?? [];
    const { subtotal, gstAmount, total } = calculateTotals(items, gstRate);
    const payload: Partial<IInvoice> = {
      ...data,
      title: data.title ?? 'Tax Invoice',
      gstRate,
      subtotal,
      gstAmount,
      total,
    };
    return InvoiceModel.create(payload);
  }

  public async update(id: string, data: Partial<IInvoice>): Promise<IInvoice | null> {
    if (this.useMockData()) return null;
    const existing = await InvoiceModel.findById(id);
    if (!existing) return null;
    const items = data.items ?? existing.items;
    const gstRate = data.gstRate ?? existing.gstRate ?? 0.1;
    const { subtotal, gstAmount, total } = calculateTotals(items, gstRate);
    const payload = { ...data, subtotal, gstAmount, total };
    return InvoiceModel.update(id, payload);
  }

  public async delete(id: string): Promise<boolean> {
    if (this.useMockData()) return false;
    return InvoiceModel.delete(id);
  }
}
