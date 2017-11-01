const fs = require('fs');
const path = require('path');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = function (webpackConfig, env) {
  webpackConfig.babel.babelrc = false;
  webpackConfig.babel.plugins.push('transform-runtime');

/*  webpackConfig.babel.plugins.push(['import', {
    style: 'css',  // if true, use less
    libraryName: 'antd-mobile',
  }]);

  webpackConfig.postcss.push(pxtorem({
    rootValue: 100,
    propWhiteList: [],
  });*/

  // Enable hmr for development.
  /*
  if (env === 'development') {
    webpackConfig.babel.plugins.push(['dva-hmr', {
      entries: [
        './src/entry/index.jsx',
      ],
    }]);
  }
  */

  // Parse all less files as css module.
  /*
  webpackConfig.module.loaders.forEach(function (loader, index) {
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.test = /\.less$/;
    }
  });
  */

  webpackConfig.module.loaders[12] =
    {
      test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
      loader: 'url-loader?limit=8192&name=img/[name].[ext]'
    };
  webpackConfig.plugins.push( new CopyWebpackPlugin([{
    from: __dirname + '/favicon.ico',
    to: __dirname + '/build'
  },{
    from: __dirname + '/index.html',
    to: __dirname + '/build'
  },{
    from: __dirname + '/src/img',
    to: __dirname + '/build/img'
  }]));
  return webpackConfig;
};
