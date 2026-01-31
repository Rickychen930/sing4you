import { clsx, type ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]): string => {
  return clsx(...inputs);
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

/** Get category display name from performance (populated or id). */
export function getPerformanceCategoryName(performance: { category?: unknown; categoryId?: string }): string {
  if (!performance.category) return '';
  if (typeof performance.category === 'object' && performance.category !== null && 'name' in performance.category) {
    return (performance.category as { name: string }).name;
  }
  return '';
}

/** Get variation/variant display name from performance (populated or id). */
export function getPerformanceVariantName(performance: { variation?: unknown; variationId?: string }): string {
  if (!performance.variation) return '';
  if (typeof performance.variation === 'object' && performance.variation !== null && 'name' in performance.variation) {
    return (performance.variation as { name: string }).name;
  }
  return '';
}