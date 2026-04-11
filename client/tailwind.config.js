/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fdf7ff',
          100: '#fbe4fc',
          200: '#f9a8d4',
          300: '#f472b6',
          400: '#ec4899',
          500: '#db2777',
          600: '#be185d',
          700: '#9d174d',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8f7',
          200: '#e9deee',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#4a3a5c',
          950: '#2d2640',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}