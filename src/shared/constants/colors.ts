/**
 * Color Constants
 * 
 * Centralized color definitions matching Tailwind config.
 * Use these constants for consistent theming across the application.
 */

// Jazz Elegant Gold - warm, luxurious
export const GOLD_COLORS = {
  50: '#fffdf7',
  100: '#fff9e8',
  200: '#fff1c8',
  300: '#ffe59e',
  400: '#ffd366',
  500: '#ffc233',
  600: '#e8a822',
  700: '#cc8b1a',
  800: '#a66e18',
  900: '#8a5918',
} as const;

// Deep Burgundy - jazz club elegance
export const BURGUNDY_COLORS = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
} as const;

// Jazz Navy - sophisticated depth
export const JAZZ_COLORS = {
  50: '#f0f4f8',
  100: '#d9e2ec',
  200: '#bcccdc',
  300: '#9fb3c8',
  400: '#829ab1',
  500: '#627d98',
  600: '#486581',
  700: '#334e68',
  800: '#243b53',
  900: '#102a43',
} as const;

// Deep Purple - musical vibes
export const MUSICAL_COLORS = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
} as const;

// Rich Brown - warm elegance
export const BRONZE_COLORS = {
  50: '#fdf8f6',
  100: '#f2e8e5',
  200: '#eaddd7',
  300: '#e0cec7',
  400: '#d2bab0',
  500: '#bfa094',
  600: '#a18072',
  700: '#977669',
  800: '#846358',
  900: '#43302b',
} as const;

// Base colors
export const BASE_COLORS = {
  black: '#0a0e1a',
  darkNavy: '#102a43',
  darkBlue: '#1a1a2e',
  darkSlate: '#16213e',
  lightGray: '#f0f4f8',
  white: '#ffffff',
} as const;

// RGBA color helpers for opacity variations
export const COLOR_RGBA = {
  // Gold with opacity
  gold: {
    '500-10': 'rgba(255, 194, 51, 0.1)',
    '500-15': 'rgba(255, 194, 51, 0.15)',
    '500-20': 'rgba(255, 194, 51, 0.2)',
    '500-25': 'rgba(255, 194, 51, 0.25)',
    '500-30': 'rgba(255, 194, 51, 0.3)',
    '500-40': 'rgba(255, 194, 51, 0.4)',
    '500-50': 'rgba(255, 194, 51, 0.5)',
    '500-60': 'rgba(255, 194, 51, 0.6)',
    '500-70': 'rgba(255, 194, 51, 0.7)',
    '500-80': 'rgba(255, 194, 51, 0.8)',
    '600-30': 'rgba(232, 168, 34, 0.3)',
    '600-40': 'rgba(232, 168, 34, 0.4)',
  },
  // Musical/Purple with opacity - using musical-500 (#a855f7 = 168, 85, 247)
  musical: {
    '500-10': 'rgba(168, 85, 247, 0.1)',
    '500-15': 'rgba(168, 85, 247, 0.15)',
    '500-20': 'rgba(168, 85, 247, 0.2)',
    '500-25': 'rgba(168, 85, 247, 0.25)',
    '500-30': 'rgba(168, 85, 247, 0.3)',
    '500-40': 'rgba(168, 85, 247, 0.4)',
    '500-50': 'rgba(168, 85, 247, 0.5)',
    '500-60': 'rgba(168, 85, 247, 0.6)',
    '600-30': 'rgba(147, 51, 234, 0.3)',
    '600-40': 'rgba(147, 51, 234, 0.4)',
  },
  // Jazz/Navy with opacity
  jazz: {
    '900-20': 'rgba(16, 42, 67, 0.2)',
    '900-30': 'rgba(16, 42, 67, 0.3)',
    '900-40': 'rgba(16, 42, 67, 0.4)',
    '900-50': 'rgba(16, 42, 67, 0.5)',
    '900-60': 'rgba(16, 42, 67, 0.6)',
    '900-70': 'rgba(16, 42, 67, 0.7)',
    '900-80': 'rgba(16, 42, 67, 0.8)',
    '900-90': 'rgba(16, 42, 67, 0.9)',
  },
  // Black with opacity
  black: {
    '30': 'rgba(0, 0, 0, 0.3)',
    '40': 'rgba(0, 0, 0, 0.4)',
    '50': 'rgba(0, 0, 0, 0.5)',
    '60': 'rgba(0, 0, 0, 0.6)',
  },
  // White with opacity
  white: {
    '05': 'rgba(255, 255, 255, 0.05)',
    '10': 'rgba(255, 255, 255, 0.1)',
    '15': 'rgba(255, 255, 255, 0.15)',
    '20': 'rgba(255, 255, 255, 0.2)',
    '25': 'rgba(255, 255, 255, 0.25)',
    '30': 'rgba(255, 255, 255, 0.3)',
    '40': 'rgba(255, 255, 255, 0.4)',
    '50': 'rgba(255, 255, 255, 0.5)',
    '60': 'rgba(255, 255, 255, 0.6)',
    '70': 'rgba(255, 255, 255, 0.7)',
    '80': 'rgba(255, 255, 255, 0.8)',
    '90': 'rgba(255, 255, 255, 0.9)',
  },
} as const;

// Gradient definitions
export const GRADIENTS = {
  jazz: 'linear-gradient(135deg, #102a43 0%, #243b53 25%, #7e22ce 50%, #991b1b 75%, #102a43 100%)',
  elegant: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  musical: 'linear-gradient(135deg, #7f1d1d 0%, #6b21a8 50%, #102a43 100%)',
  gold: 'linear-gradient(135deg, #ffc233 0%, #e8a822 50%, #cc8b1a 100%)',
  body: 'linear-gradient(135deg, #0a0e1a 0%, #102a43 25%, #1a1a2e 50%, #16213e 75%, #0a0e1a 100%)',
  goldText: 'linear-gradient(90deg, #ffc233 0%, #e8a822 25%, #ffc233 50%, #a855f7 75%, #ffc233 100%)',
} as const;

// Shadow definitions
export const SHADOWS = {
  jazz: '0 10px 40px rgba(31, 38, 135, 0.37)',
  elegant: '0 8px 32px rgba(0, 0, 0, 0.12)',
  musical: '0 4px 20px rgba(168, 85, 247, 0.3)',
  musicalGlow: '0 0 30px rgba(255, 194, 51, 0.4), 0 0 60px rgba(168, 85, 247, 0.3), 0 0 90px rgba(255, 194, 51, 0.2)',
  goldGlow: '0 0 20px rgba(255, 194, 51, 0.5), 0 0 40px rgba(255, 194, 51, 0.3)',
  purpleGlow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
} as const;

// Text shadow definitions — harmonized (see DESIGN_SYSTEM.md)
export const TEXT_SHADOWS = {
  h1: '0 4px 16px rgba(255, 194, 51, 0.25), 0 2px 8px rgba(168, 85, 247, 0.15)',
  h2: '0 3px 12px rgba(255, 194, 51, 0.22), 0 1px 6px rgba(168, 85, 247, 0.12)',
  h3: '0 2px 10px rgba(255, 194, 51, 0.2)',
  base: '0 2px 10px rgba(255, 194, 51, 0.2), 0 1px 4px rgba(168, 85, 247, 0.12)',
  link: '0 0 8px rgba(255, 194, 51, 0.4)',
} as const;
