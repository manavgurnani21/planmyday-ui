/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f8fafa',
          100: '#eef1f1',
          200: '#dde2e3',
          400: '#8a9396',
          600: '#4d5658',
          800: '#1f2627',
          900: '#0f1314',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,19,20,0.04), 0 4px 12px rgba(15,19,20,0.06)',
        pop: '0 8px 32px rgba(15,19,20,0.12)',
      },
    },
  },
  plugins: [],
};
