const {merge} = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devServer: {
    port: 3003,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    proxy: {
      '/testapi': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/testapi': '' },
      },
    },
  },
  devtool: 'eval-source-map',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: '8888',
      generateStatsFile: true,
      statsOptions: { source: false },
  }),
  ]
});
