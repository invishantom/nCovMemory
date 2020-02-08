const path = require('path');
module.exports = {
  indexPath: '../../index.html',
  publicPath: process.env.NODE_ENV === 'production' ? '/nCovMemory/gitpage/dist' : '/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.csv$/,
          use: 'raw-loader'
        },
        {
          test: /\.handlebars$/,
          use: 'raw-loader'
        },
        {
          test: /\.md$/,
          use: 'raw-loader'
        }
      ]
    }
  }
};
