/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          navy: '#0f1b2d',
          'navy-light': '#1a2d4a',
          'navy-lighter': '#243b55',
          orange: '#ff9900',
          'orange-dark': '#e68a00',
          'orange-light': '#ffb84d',
          teal: '#00a1c9',
          'teal-dark': '#007fa3',
          green: '#1db954',
          'green-dark': '#179a45',
        },
      },
      fontFamily: {
        sans: ['Amazon Ember', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Source Code Pro', 'Consolas', 'monospace'],
      },
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateY(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        flipOut: {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '100%': { transform: 'rotateY(90deg)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'flip-in': 'flipIn 0.3s ease-out forwards',
        'flip-out': 'flipOut 0.3s ease-in forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
