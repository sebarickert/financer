const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'blue-financer': '#0E6AC7',
        'white-off': '#FAFAFA',
        'gray-25': '#fdfdfd',
        'gray-financer': '#838690',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-safe-area')],
};
