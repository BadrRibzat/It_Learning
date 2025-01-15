/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#34D399',
        accent: '#818CF8',
        background: '#F3F4F6',
        text: '#1F2937',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
      },
      fonts: {
        main: 'Inter, sans-serif',
        headings: 'Poppins, sans-serif',
      },
    },
  },
  plugins: [],
}
