import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE_TEMPLATE } from '../constants';

export const generateWhatsAppLink = (message?: string, phone?: string): string => {
  const phoneNumber = phone || WHATSAPP_NUMBER;
  const defaultMessage = WHATSAPP_MESSAGE_TEMPLATE();
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  return `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
};