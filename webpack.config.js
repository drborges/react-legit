/* eslint-disable filenames/match-regex, import/no-commonjs */
module.exports = {
  devtool: "eval-source-map",
  entry: [
    "babel-polyfill",
  ],
  output: {
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(s)?css$/,
        exclude: [/node_modules/],
        use: [
          "style-loader",
          "css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ]
  }
}

