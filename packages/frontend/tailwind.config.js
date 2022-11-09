const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')

const colorPalette = {
  red: '#dc2626',
  green: '#059669',
  blue: '#0065ff',
  charcoal: '#202626',
  gray: '#fafafa',
  'gray-dark': '#f2f2f2',
  'gray-darkest': '#646464',
};

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/**/*.html'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      ...colorPalette
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-safe-area')],
};
