/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0F0F0F',
          secondary: '#1A1A1A',
          card: '#252525',
          input: '#1A1A1A',
        },
        text: {
          primary: '#E5E5E5',
          muted: '#888888',
        },
        pink: {
          DEFAULT: '#FF69B4',
          light: '#FF85C1',
          dark: '#D454A0',
          blush: '#FFB6C1',
        },
        success: '#22C55E',
        error: '#F87171',
        warning: '#FBBF24',
        border: '#333333',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}