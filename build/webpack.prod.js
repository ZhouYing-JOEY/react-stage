const path = require('path');
const {merge} = require('webpack-merge');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin"); // 对js进行压缩
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 对CSS进行压缩
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 每次打包前清除旧的build文件夹

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    mode: 'production',
    stats: {
      children: false, // 不输出子模块的打包信息
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true, // 多线程并行构建
          terserOptions: {
            // https://github.com/terser/terser#minify-options
            compress: {
              warnings: false, // 删除无用代码时是否给出警告
              drop_debugger: true, // 删除所有的debugger
              drop_console: true, // 删除所有的console.*
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
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
                limit: 1000,
                name: "assets/[name].[hash:4].[ext]",
              },
            },
          ],
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      /**
       * 在window环境中注入全局变量,虽然暂时没用上，不过在真实开发中应该会用到
       * **/
      new webpack.DefinePlugin({
        "process.env": "prod",
      }),
    ]
});