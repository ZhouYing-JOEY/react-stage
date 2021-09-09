const webpacBaseConfig = require('./webpack.config')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

module.exports = merge(webpacBaseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        compress: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
      extensions: [".js", ".jsx", ".less", ".css"], //后缀名自动补全
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
})
