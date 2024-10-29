/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#646cff',
        'primary-dark': '#535bf2',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
   require('@tailwindcss/forms'),
   require('@tailwindcss/typography'),
   require('@tailwindcss/aspect-ratio'),
  ],
}
