const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./build/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "server.js",
  },
  target: "node",
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  stats: {
    warningsFilter: /require\.extensions/,
  },
};
