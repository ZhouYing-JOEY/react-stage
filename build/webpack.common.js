const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackbar = require("webpackbar");

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
      main: path.join(__dirname, '../index.js'),
    },
    output: {
      path: path.join(__dirname, '../dist'),
      filename: '[name].[chunkhash:8].js',
      publicPath: "/",
      chunkFilename: 'chunk/[name].[chunkhash:8].js',
    },
    resolve: {
      extensions: [".js", ".jsx", ".less", ".css"], //后缀名自动补全
      alias: {
        "@": path.resolve(__dirname, "../src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.less$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          // 图片解析
          test: /\.(png|jpg|jpeg|gif)$/i,
          include: path.resolve(__dirname, "../src"),
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
      new webpackbar(),
      new HtmlWebpackPlugin({
        // 根据模板插入css/js等生成最终HTML
        filename: "index.html", //生成的html存放路径，相对于 output.path
        favicon: "./public/favicon.png", // 自动把根目录下的favicon.ico图片加入html
        template: "./public/index.html", //html模板路径
        inject: true, // 是否将js放在body的末尾
      }),
      /**
       * 提取CSS等样式生成单独的CSS文件,不然最终文件只有js； css全部包含在js中
       * https://github.com/webpack-contrib/mini-css-extract-plugin
       * **/
       new MiniCssExtractPlugin({
        filename: "dist/[name].[chunkhash:8].css", // 生成的文件名
      }),
      // 拷贝public中的文件到最终打包文件夹里
      new CopyPlugin({
        patterns: [
          {
            from: "./public/**/*",
            to: "./",
            globOptions: {
              ignore: ["**/favicon.png", "**/index.html"],
            },
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
}