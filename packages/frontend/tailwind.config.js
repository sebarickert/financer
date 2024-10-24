/** @type {import('tailwindcss').Config} */
const { colors } = require("@carbon/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

const carbonColors = Object.keys(colors).reduce((acc, color) => {
  if (Object.keys(colors[color]).length === 1) {
    return { ...acc, [color]: Object.values(colors[color])[0] };
  }

  const palette = Object.keys(colors[color]).reduce((paletteAcc, stop) => {
    const stopNumber = Number(`${stop}0`);
    paletteAcc[stopNumber] = colors[color][stop];
    return paletteAcc;
  }, {});

  return { ...acc, [color]: palette };
}, {});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./(src|app|containers)/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...carbonColors,
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-safe-area"),
    require("@tailwindcss/typography"),
    require("tailwindcss-view-transitions"),
    require("@tailwindcss/container-queries"),
  ],
};
