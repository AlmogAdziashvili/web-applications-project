const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = require('./webpack.config');

config.optimization = {
  minimize: true,
};

config.plugins.push(new BundleAnalyzerPlugin({
  analyzerMode: 'static',
}));

const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
  filename: '[name].[fullhash].css',
  chunkFilename: '[id].[fullhash].css',
});

config.plugins.push(MiniCssExtractPluginConfig);

module.exports = config;
