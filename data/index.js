var path = require('path');
var fs = require('fs-extra');
require.extensions['.csv'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const DATA = require('./data.csv');

module.exports = {
  DATA: {
    data: DATA,
    path: path.resolve(__dirname, 'data.csv'),
    fetch_url:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnlR_cNBel5NefYdsLtxdiro6KEl_SI9MyKDE_3pgBLHgfuySTZCFHeVufAZAkU-2MfaMO-ZyVtTxr/pub?gid=1097066541&single=true&output=csv'
  }
};
