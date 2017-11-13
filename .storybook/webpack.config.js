const path = require('path');

module.exports = {
  resolve: {
    modules: [
      path.resolve(__dirname, "../src"),
      "../node_modules",
    ],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
}