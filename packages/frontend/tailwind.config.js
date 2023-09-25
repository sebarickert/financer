const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')
const colorPalette = require('./src/constants/colorPaletteRaw.json')

/** @type {import('tailwindcss').Config} */
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
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-safe-area'),
    require('@tailwindcss/typography'),
    require("tailwindcss-view-transitions")
  ],
};
