const path = require('path');
var fs = require('fs-extra');
const ARCHIVE = require('../archive/index');
const DATA = require('../data/index');
const Papa = require('papaparse');

Papa.parsePromise = function(file, options) {
  return new Promise(function(complete, error) {
    Papa.parse(file, { complete, error, ...options });
  });
};

async function rename() {
  let csv = fs.readFileSync(DATA['data'].path, 'utf8');
  // Read csv
  let { data } = await Papa.parsePromise(csv, { header: true });
  data = data.filter(
    (entry) =>
      entry.old_name && entry.title && entry.media && entry.date && entry.update && entry.url
  );
  // Extract medias and articles
  for (let entry of data) {
    // Calculate attributes
    if (entry.old_name && ARCHIVE.hasOwnProperty(entry.old_name)) {
      entry = { ...ARCHIVE[entry.old_name], ...entry };
      // console.log(entry);
      try {
        fs.renameSync(
          `d:/Coding/nCovMemory/archive/png/${entry.old_name}.png`,
          `d:/Coding/nCovMemory/archive/png/${entry.id}.png`
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
}

rename();
