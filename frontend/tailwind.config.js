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
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        brand: {
          blue: '#1e3a8a',
          teal: '#0d9488',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
