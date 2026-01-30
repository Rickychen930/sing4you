import { apiClient } from './api';
import type { IInvoice } from '../../shared/interfaces';

export class InvoiceService {
  async getAll(): Promise<IInvoice[]> {
    return apiClient.get<IInvoice[]>('/api/admin/invoices', false);
  }

  async getById(id: string): Promise<IInvoice> {
    return apiClient.get<IInvoice>(`/api/admin/invoices/${id}`);
  }

  async getByClientId(clientId: string): Promise<IInvoice[]> {
    return apiClient.get<IInvoice[]>(`/api/admin/clients/${clientId}/invoices`, false);
  }

  async getNextInvoiceNumber(): Promise<string> {
    const res = await apiClient.get<{ invoiceNumber: string }>('/api/admin/invoices/next-number', false);
    return res.invoiceNumber;
  }

  async create(data: Partial<IInvoice>): Promise<IInvoice> {
    return apiClient.post<IInvoice>('/api/admin/invoices', data);
  }

  async update(id: string, data: Partial<IInvoice>): Promise<IInvoice> {
    return apiClient.put<IInvoice>(`/api/admin/invoices/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/invoices/${id}`);
  }
}

export const invoiceService = new InvoiceService();
