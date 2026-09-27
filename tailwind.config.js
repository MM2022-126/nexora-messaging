/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#fffaf5',
          100: '#fef0e6',
          200: '#f7d7c5',
          300: '#efb59b',
          400: '#e28a69',
          500: '#d9775f',
          600: '#c7654e',
          700: '#a64f3d',
          800: '#7f3d34',
          900: '#4b2a25',
        },
        sage: {
          50: '#f5f8f5',
          100: '#e7efe9',
          200: '#cfe1d3',
          300: '#aec8b0',
          400: '#87ab8b',
          500: '#6f8f7a',
          600: '#577563',
          700: '#446150',
          800: '#324d3d',
          900: '#1f362a',
        },
        sand: {
          50: '#f9f5ef',
          100: '#f1e7db',
          200: '#e4d2b8',
          300: '#d4b68a',
          400: '#c79a67',
        },
      },
      boxShadow: {
        soft: '0 14px 34px rgba(79, 53, 43, 0.12)',
      },
    },
  },
  plugins: [],
};
