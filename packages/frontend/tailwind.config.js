const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const colorPalette = require("./src/constants/colorPaletteRaw.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./(src|app|containers)/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      ...colorPalette,
    },
    extend: {
      fontFamily: {
        sans: ["Euclid Circular A", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-safe-area"),
    require("@tailwindcss/typography"),
    require("tailwindcss-view-transitions"),
  ],
};
