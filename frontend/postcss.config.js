const tailwindcss = require("@tailwindcss/jit");
module.exports = {
  plugins: [tailwindcss("./tailwind.config.js"), require("autoprefixer")],
};
