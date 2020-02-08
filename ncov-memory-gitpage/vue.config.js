const path = require('path');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/nCovMemory/' : '/',
  outputDir: path.resolve(__dirname, '../'),
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
        }
      ]
    }
  }
};
