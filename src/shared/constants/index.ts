/**
 * Shared Constants
 * 
 * Centralized constants for the entire application.
 * Re-export all constants from their respective modules.
 */

// Application Constants
export const SECTION_TYPES = [
  'solo',
  'duo',
  'trio',
  'band',
  'wedding',
  'corporate',
  'other',
] as const;

export const EVENT_TYPES = [
  'wedding',
  'corporate',
  'private',
  'concert',
  'festival',
  'other',
] as const;

export const DEFAULT_CITY = 'Sydney';
export const DEFAULT_STATE = 'NSW';
export const DEFAULT_COUNTRY = 'Australia';

export const WHATSAPP_NUMBER = '+61400000000'; // Replace with actual number
export const CONTACT_EMAIL = 'christina@sings4u.com.au'; // Replace with actual email

export const WHATSAPP_MESSAGE_TEMPLATE = (location: string = 'Sydney/NSW') =>
  `Hi Christina, I'd like to book you for an event in [${location}].`;

export const EMAIL_SUBJECT_TEMPLATE = 'Booking Inquiry – Christina Sings4U';
export const EMAIL_BODY_TEMPLATE = (details?: string) =>
  `Hello Christina,\n\nI would like to inquire about booking your services.\n\n${details || ''}\n\nBest regards`;

export const PAGE_TITLES = {
  HOME: 'Christina Sings4U | Professional Singer in Sydney',
  PERFORMANCES: 'Upcoming Performances | Christina Sings4U',
  CONTACT: 'Contact | Christina Sings4U',
  ADMIN_LOGIN: 'Admin Login | Christina Sings4U',
  ADMIN_DASHBOARD: 'Admin Dashboard | Christina Sings4U',
} as const;

// Re-export color constants
export * from './colors';

// Re-export animation constants
export * from './animations';

// Re-export design token constants
export * from './design-tokens';