const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const Papa = require('papaparse');
const CSV_PATHS = require('../data/index');

Papa.parsePromise = function(file, options) {
  return new Promise(function(complete, error) {
    Papa.parse(file, { complete, error, ...options });
  });
};

function trimAttributes(object, attributes) {
  attributes.forEach((a) => {
    if (object.hasOwnProperty(a) && object[a]) {
      object[a] = object[a].trim();
    }
  });
}

async function build() {
  for (key in CSV_PATHS) {
    let response = await fetch(CSV_PATHS[key].fetch_url);
    let srcCSV = await response.text();
    srcCSV = srcCSV.replace(/\u200B/g, '');
    let { data: csvData } = await Papa.parsePromise(srcCSV, { header: true });
    csvData = csvData
      .filter(
        (entry) =>
          entry.id && entry.category && entry.title && entry.media && entry.date && entry.update
      )
      .map((entry) => {
        trimAttributes(entry, ['title', 'title_en', 'media']);
        return entry;
      });
    let buildCSV = Papa.unparse(csvData);
    fs.writeFileSync(CSV_PATHS[key].path, buildCSV, 'utf-8');
    console.log(`Build ${key} succeed!`);
  }
}
build();
