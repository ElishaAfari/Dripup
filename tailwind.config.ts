import type { Config } from 'tailwindcss'

const config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#fbf8f2',
          dark: '#10100f',
        },
        ink: {
          DEFAULT: '#171512',
          muted: '#766f66',
          inverse: '#fbf8f2',
        },
        atelier: {
          saffron: '#d99a26',
          rouge: '#b63d4f',
          fern: '#59735f',
          indigo: '#252f55',
          mist: '#e6dfd3',
          charcoal: '#171512',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(23, 21, 18, 0.12)',
        lift: '0 18px 45px rgba(89, 115, 95, 0.18)',
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 1px 1px, rgba(23, 21, 18, 0.075) 1px, transparent 0)",
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
