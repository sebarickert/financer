/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./(src|app|containers)/**/*.{js,ts,jsx,tsx}"],
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(.light *) }",
      "&:is(.dark *)",
    ],
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "hsl(var(--color-white))",
      blue: "hsl(var(--color-blue))",
      green: "hsl(var(--color-green))",
      red: "hsl(var(--color-red))",
      background: "hsl(var(--color-background))",
      layer: "hsl(var(--color-layer))",
      ["text-primary"]: "hsl(var(--color-text-primary))",
      ["text-secondary"]: "hsl(var(--color-text-secondary))",
      ["text-tertiary"]: "hsl(var(--color-text-tertiary))",
      ["border-primary"]: "hsl(var(--color-border-primary))",
      ["border-secondary"]: "hsl(var(--color-border-secondary))",
    },
    extend: {
      fontFamily: {
        sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-safe-area"),
    require("@tailwindcss/typography"),
    require("tailwindcss-view-transitions"),
    require("@tailwindcss/container-queries"),
    plugin(function ({ addVariant, addUtilities }) {
      addVariant("starting", "@starting-style");
      addVariant("open", "&:is([open], :popover-open)");
      addVariant("backdrop", "&::backdrop");
      addUtilities({
        ".transition-allow-discrete": {
          "transition-behavior": "allow-discrete",
        },
        ".transition-behavior-normal": {
          "transition-behavior": "normal",
        },
      });
    }),
    plugin(function ({ matchUtilities }) {
      const allowedDirections = ["top", "right", "bottom", "left"];

      const validateAnchor = (values) => {
        const anchorName = values[0];

        if (!anchorName) {
          console.warn("anchor-name is required");
          return false;
        }

        if (values.length > 1 && !allowedDirections.includes(values[1])) {
          console.warn(
            `Invalid direction. Allowed values are: ${allowedDirections.join(", ")}`
          );
          return false;
        }

        if (values.length > 2) {
          console.warn(
            "Too many values. Only anchor-name and direction are allowed"
          );
          return false;
        }

        return true;
      };

      /**
       * Register new dynamic utility styles
       * @link https://tailwindcss.com/docs/plugins#dynamic-utilities
       */
      matchUtilities({
        "anchor-name": (value) => ({ anchorName: `--${value}` }),
        "right-anchor": (value) => {
          const values = value.split(",");

          if (!validateAnchor(values)) return;
          const anchorName = values[0];
          const direction = values[1] || "right";

          return { right: `anchor(--${anchorName} ${direction})` };
        },
        "top-anchor": (value) => {
          const values = value.split(",");

          if (!validateAnchor(values)) return;
          const anchorName = values[0];
          const direction = values[1] || "top";

          return { top: `anchor(--${anchorName} ${direction})` };
        },
        "bottom-anchor": (value) => {
          const values = value.split(",");

          if (!validateAnchor(values)) return;
          const anchorName = values[0];
          const direction = values[1] || "bottom";

          return { bottom: `anchor(--${anchorName} ${direction})` };
        },
        "left-anchor": (value) => {
          const values = value.split(",");

          if (!validateAnchor(values)) return;
          const anchorName = values[0];
          const direction = values[1] || "left";

          return { left: `anchor(--${anchorName} ${direction})` };
        },
      });
    }),
  ],
};
