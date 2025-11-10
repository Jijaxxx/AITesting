/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
        },
        secondary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
          600: '#EA580C',
        },
      },
      fontFamily: {
        sans: ['Comic Neue', 'Comic Sans MS', 'cursive'],
        display: ['Fredoka', 'Comic Neue', 'cursive'],
      },
      fontSize: {
        'child-sm': ['1.25rem', { lineHeight: '1.75rem' }],
        'child-base': ['1.5rem', { lineHeight: '2rem' }],
        'child-lg': ['2rem', { lineHeight: '2.5rem' }],
        'child-xl': ['2.5rem', { lineHeight: '3rem' }],
        'child-2xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'star': 'star 0.6s ease-out forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        star: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
