module.exports = {
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
