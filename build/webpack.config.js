const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpackbar = require("webpackbar");

console.log(path.resolve(__dirname, '../src'), 'xxxx')
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js",
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/, 
            use: 'babel-loader', 
            include: path.resolve(__dirname, '../src'),
            exclude: /node_modules/,
        },
        {
          // .css 解析
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          // .less 解析
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader",
            {
              loader: "less-loader",
              options: { lessOptions: { javascriptEnabled: true } },
            },
          ],
        },
        {
          // 图片解析
          test: /\.(png|jpg|jpeg|gif)$/i,
          include: path.resolve(__dirname, "src"),
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                name: "assets/[name].[hash:4].[ext]",
              },
            },
          ],
        },
    ]
  },
  plugins: [
    new webpackbar(),
    new HtmlWebPackPlugin({
      title: "Hello React!",
      template: "./public/index.html",
      // inject: true, 
    }),
  ],
  performance: false,
};