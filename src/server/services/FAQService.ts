import { FAQModel } from '../models/FAQModel';
import type { IFAQ } from '../../shared/interfaces';

export class FAQService {
  async getAll(activeOnly: boolean = true): Promise<IFAQ[]> {
    return FAQModel.findAll(activeOnly);
  }

  async getById(id: string): Promise<IFAQ | null> {
    return FAQModel.findById(id);
  }

  async create(data: Partial<IFAQ>): Promise<IFAQ> {
    // Auto-set order if not provided
    if (data.order === undefined) {
      const allFAQs = await FAQModel.findAll(false);
      data.order = allFAQs.length;
    }
    return FAQModel.create(data);
  }

  async update(id: string, data: Partial<IFAQ>): Promise<IFAQ | null> {
    return FAQModel.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return FAQModel.delete(id);
  }
}

export const faqService = new FAQService();
