import { apiClient } from './api';
import type { IContactForm } from '../../shared/interfaces';

export class ContactService {
  async submitForm(data: IContactForm): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>('/api/contact', data);
  }
}

export const contactService = new ContactService();