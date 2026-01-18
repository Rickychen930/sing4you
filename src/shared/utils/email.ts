import { CONTACT_EMAIL, EMAIL_SUBJECT_TEMPLATE, EMAIL_BODY_TEMPLATE } from '../constants';

export const generateMailtoLink = (
  subject?: string,
  body?: string,
  email?: string
): string => {
  const to = email || CONTACT_EMAIL;
  const emailSubject = subject || EMAIL_SUBJECT_TEMPLATE;
  const emailBody = body || EMAIL_BODY_TEMPLATE();
  
  const params = new URLSearchParams({
    subject: emailSubject,
    body: emailBody,
  });
  
  return `mailto:${to}?${params.toString()}`;
};