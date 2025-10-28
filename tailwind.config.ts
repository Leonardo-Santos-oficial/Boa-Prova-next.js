import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151', // colors.gray.700
            a: {
              color: '#2563eb', // colors.primary.600
              textDecoration: 'none',
              '&:hover': {
                color: '#1d4ed8', // colors.primary.700
              },
            },
            h1: {
              color: '#111827', // colors.gray.900
            },
            h2: {
              color: '#111827',
            },
            h3: {
              color: '#111827',
            },
            strong: {
              color: '#111827',
            },
          },
        },
        dark: {
          css: {
            color: '#d1d5db', // colors.gray.300
            a: {
              color: '#60a5fa', // colors.primary.400
              '&:hover': {
                color: '#93c5fd', // colors.primary.300
              },
            },
            h1: { color: '#f3f4f6' }, // colors.gray.100
            h2: { color: '#f3f4f6' },
            h3: { color: '#f3f4f6' },
            h4: { color: '#f3f4f6' },
            strong: { color: '#f3f4f6' },
            code: { color: '#f3f4f6' },
            blockquote: {
              color: '#d1d5db',
              borderLeftColor: '#374151', // colors.gray.700
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}

export default config
