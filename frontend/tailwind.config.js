/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
        muted: '#6b7280'
      }
    },
  },
  plugins: [],
};


