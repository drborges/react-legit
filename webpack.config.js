const path = require("path");

module.exports = {
  devtool: "eval-source-map",
  entry: [
    "./src/Validation",
  ],
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    library: "react-legit",
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(s)?css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader?importLoader=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]",
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
