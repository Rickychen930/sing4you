import { format } from 'date-fns';

// Format date for Australian display (DD/MM/YYYY)
export const formatAustralianDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

// Format date with time for Australian display
export const formatAustralianDateTime = (date: Date | string, time: string): string => {
  return `${formatAustralianDate(date)} at ${time}`;
};

// Format date for ISO string
export const formatISO = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};