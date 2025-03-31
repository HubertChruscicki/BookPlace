/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // lub 'media'
  theme: {
    extend: {
      colors: {
        primary: '#1976d2', // np. kolor z MUI
        secondary: '#9c27b0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}