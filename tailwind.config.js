/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Jazz Elegant Gold - warm, luxurious
        gold: {
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
        },
        // Deep Burgundy - jazz club elegance
        burgundy: {
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
        },
        // Jazz Navy - sophisticated depth
        jazz: {
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
        },
        // Deep Purple - musical vibes
        musical: {
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
        },
        // Rich Brown - warm elegance
        bronze: {
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
        },
      },
      fontFamily: {
        elegant: ['Playfair Display', 'serif'],
        musical: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'jazz-gradient': 'linear-gradient(135deg, #102a43 0%, #243b53 25%, #7e22ce 50%, #991b1b 75%, #102a43 100%)',
        'elegant-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'musical-gradient': 'linear-gradient(135deg, #7f1d1d 0%, #6b21a8 50%, #102a43 100%)',
        'gold-gradient': 'linear-gradient(135deg, #ffc233 0%, #e8a822 50%, #cc8b1a 100%)',
      },
      boxShadow: {
        'jazz': '0 10px 40px rgba(31, 38, 135, 0.37)',
        'elegant': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'musical': '0 4px 20px rgba(126, 34, 206, 0.3)',
        'musical-glow': '0 0 30px rgba(255, 194, 51, 0.4), 0 0 60px rgba(126, 34, 206, 0.3), 0 0 90px rgba(255, 194, 51, 0.2)',
        'gold-glow': '0 0 20px rgba(255, 194, 51, 0.5), 0 0 40px rgba(255, 194, 51, 0.3)',
        'purple-glow': '0 0 20px rgba(126, 34, 206, 0.5), 0 0 40px rgba(126, 34, 206, 0.3)',
      },
      animation: {
        'musical-float': 'float 6s ease-in-out infinite',
        'musical-pulse': 'musicalPulse 2s ease-in-out infinite',
        'musical-sparkle': 'sparkle 2s ease-in-out infinite',
        'musical-shimmer': 'shimmerMusical 3s linear infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'wave-reverse': 'waveReverse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}