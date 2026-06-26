import type { Config } from 'tailwindcss'

const config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#f7fbff',
          dark: '#050806',
        },
        ink: {
          DEFAULT: '#06110d',
          muted: '#5f706c',
          inverse: '#ffffff',
        },
        atelier: {
          saffron: '#00b86b',
          rouge: '#1267ff',
          fern: '#008a5a',
          indigo: '#063a8f',
          mist: '#dbeafe',
          charcoal: '#050806',
          blue: '#1267ff',
          green: '#00b86b',
          white: '#ffffff',
          black: '#050806',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(5, 8, 6, 0.12)',
        lift: '0 18px 45px rgba(18, 103, 255, 0.18)',
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 1px 1px, rgba(5, 8, 6, 0.07) 1px, transparent 0)",
      },
      borderRadius: {
        atelier: '1rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
