import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3BAE5D',
          dark: '#2D8A49',
          accent: '#6CCB7F',
        },
        surface: {
          light: '#F5F7F9',
          border: '#E5E7EB',
          darkBase: '#1A2028',
          darkCard: '#232A34',
          darkBorder: '#333B47',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          critical: '#EF4444',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          darkPrimary: '#F3F4F6',
          darkSecondary: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 12px rgba(17, 24, 39, 0.06)',
        'card-dark':
          '0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
