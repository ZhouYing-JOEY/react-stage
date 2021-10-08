const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, './index.js'),
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
    },
    devServer: {
        port: 3011,
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
      },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ["babel-loader"],
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./index.html",
        inject: true,
      }),
    ]
}