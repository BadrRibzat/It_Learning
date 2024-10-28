/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
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
