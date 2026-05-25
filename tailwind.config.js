/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aws: {
          orange: '#ff9900',
          'orange-dark': '#e68a00',
          navy: '#0f1b2d',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(245,158,11,0.6)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'slide-right': 'slide-right 0.3s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
