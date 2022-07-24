/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8404D9',
          50: '#D598FD',
          100: '#CC83FD',
          200: '#BC5BFC',
          300: '#AB33FB',
          400: '#9B0BFB',
          500: '#8404D9',
          600: '#6203A2',
          700: '#41026B',
          800: '#1F0134',
          900: '#000000',
        },
      },
    },
  },
  plugins: [],
};
