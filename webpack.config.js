const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

const env = process.env.NODE_ENV;
const prodBuild = env === 'production';

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
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0,
    }),
  ],
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
