var path = require('path');
var fs = require('fs-extra');
require.extensions['.handlebars'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
let TEMPLATE = require('./README.handlebars');
let TEMPLATE_EN = require('./README-en.handlebars');
let ORDERING = require('./ordering.json');
let LANGUAGES = require('./languages.json');

module.exports = {
  TEMPLATE,
  TEMPLATE_EN,
  ORDERING,
  LANGUAGES
};
