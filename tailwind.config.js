/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#841FFF',
          50: '#E9D7FF',
          100: '#DEC2FF',
          200: '#C799FF',
          300: '#B171FF',
          400: '#9A48FF',
          500: '#841FFF',
          600: '#6700E6',
          700: '#4E00AE',
          800: '#350076',
          900: '#1C003E',
        },
      },
    },
  },
  plugins: [],
};
