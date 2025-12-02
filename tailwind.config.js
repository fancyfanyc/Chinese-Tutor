/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#1a1a1a',
        'rice-paper': '#fdfbf7',
        'cinnabar': '#e63946',
      },
      fontFamily: {
        'serif': ['"Noto Serif SC"', 'serif'],
        'sans': ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}