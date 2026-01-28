/**
 * Navigation configuration — single source of truth for header and footer links.
 */

export interface NavItem {
  to: string;
  label: string;
  ariaLabel?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', ariaLabel: 'Navigate to home page' },
  { to: '/about', label: 'About', ariaLabel: 'Navigate to about page' },
  { to: '/categories', label: 'Services', ariaLabel: 'Navigate to services page' },
  { to: '/performances', label: 'Performances', ariaLabel: 'Navigate to performances page' },
  { to: '/faq', label: 'FAQ', ariaLabel: 'Navigate to FAQ page' },
  { to: '/contact', label: 'Contact', ariaLabel: 'Navigate to contact page' },
];
