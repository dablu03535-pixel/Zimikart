/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1f1a33', soft: '#4a4560', mute: '#6b667f' },
        cream: { DEFAULT: '#fbf6ee', deep: '#f2e9d8' },
        saffron: { 50: '#fff6e5', 100: '#ffe8bd', 400: '#f5a524', 500: '#e8890c', 700: '#9a5800' },
        terracotta: { 50: '#fcece8', 600: '#b8432f', 700: '#97321f' },
        peacock: { 50: '#e6f4f3', 600: '#0f6b6b', 700: '#0b5252' },
        line: '#e3dac8',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Noto Sans"', 'sans-serif'],
      },
      boxShadow: { card: '0 1px 2px rgba(31,26,51,.06), 0 6px 20px rgba(31,26,51,.06)' },
    },
  },
  plugins: [],
};
