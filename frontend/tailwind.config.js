/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#FF6F00',
          dark: '#2D2D2D',
          light: '#F4F4F5',
        }
      }
    },
  },
  plugins: [],
}