const path = require("path");

/* eslint-disable filenames/match-regex, import/no-commonjs */
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
  externals: {
    'cheerio': 'window',
    'react/addons': true, // important!!
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  module: {
    rules: [
      {
        test: /\.(s)?css$/,
        exclude: [/node_modules/],
        use: [
          "style-loader",
          "css-loader?importLoader=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]",
          "sass-loader",
        ],
      },
      {
        test: /\.js(x)?$/,
        exclude: /(node_modules|.*\.test.js|.*\.stories.js|test\.fixtures\.js)/,
        use: "babel-loader",
      },
    ]
  }
}
