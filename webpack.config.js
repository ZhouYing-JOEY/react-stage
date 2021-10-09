const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
      new HtmlWebpackPlugin({
        // 根据模板插入css/js等生成最终HTML
        filename: "index.html", //生成的html存放路径，相对于 output.path
        favicon: "./public/favicon.png", // 自动把根目录下的favicon.ico图片加入html
        template: "./public/index.html", //html模板路径
        inject: true, // 是否将js放在body的末尾
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
    resolve: {
      extensions: [".js", ".jsx", ".less", ".css"], //后缀名自动补全
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
}