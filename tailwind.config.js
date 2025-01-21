/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'cardFlip': 'cardFlip 0.6s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};