const Papa = require('papaparse');
// const Mustache = require('Mustache');
const Handlebars = require('handlebars');
const { differenceInDays, parse, compareDesc } = require('date-fns');
const path = require('path');
const README_PATH = path.join(__dirname, '..', 'README.md');
const CSV_PATHS = require('../data/index');
var querystring = require('querystring');
var fs = require('fs');

Papa.parsePromise = function(file, options) {
  return new Promise(function(complete, error) {
    Papa.parse(file, { complete, error, ...options });
  });
};
Handlebars.registerHelper('encode', function(string) {
  // return encodeURIComponent(string);
  return (string = string.replace(/[\(|\)|（|）|<|>|《|》|【|】|\[|\]|、|\/]/g, '').toLowerCase());
});
Handlebars.registerHelper('index', function(string) {
  return (string = string.replace('（个体）', ''));
});
function renameKey(o, old_key, new_key) {
  if (old_key !== new_key) {
    Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
    delete o[old_key];
  }
}
async function parseData(csvPath) {
  let now = new Date();
  let csv = fs.readFileSync(csvPath, 'utf8');
  let data = await Papa.parsePromise(csv, { header: true });
  data.data = data.data.filter(
    (entry) => entry.title && entry.media && entry.date && entry.update && entry.url
  );
  let medias = [];
  for (let entry of data.data) {
    entry.is_new = differenceInDays(now, parse(entry.update, 'MM-dd', new Date())) <= 1;
    entry.is_deleted = entry.is_deleted === 'true' || entry.is_deleted === 'TRUE';
    entry.screenshot = entry.screenshot
      ? `https://github.com/2019ncovmemory/nCovMemory/blob/master/archive/png/${entry.screenshot}.png`
      : null;
    entry.title = entry.title.replace('|', '\\|');

    if (medias.indexOf(entry.media) === -1) {
      medias.push(entry.media);
    }
  }
  medias.sort(function compareFunction(param1, param2) {
    return param1.localeCompare(param2, 'zh');
  });

  let articles = {};
  for (let media of medias) {
    articles[media] = data.data.filter((entry) => entry.media === media);
    articles[media].sort((a, b) =>
      compareDesc(parse(a.date, 'MM-dd', new Date()), parse(b.date, 'MM-dd', new Date()))
    );
  }
  return { medias, articles };
}
async function generate() {
  let model = {};
  for (key in CSV_PATHS) {
    let result = await parseData(CSV_PATHS[key].path);
    model[key] = {
      ...result
    };
  }
  let template = fs.readFileSync(
    path.join(__dirname, '..', 'template', 'README.handlebars'),
    'utf8'
  );
  for (let [index, media] of model['narrative'].medias.entries()) {
    if (model['non_fiction'].medias.indexOf(media) !== -1) {
      let newName = `${media}（个体）`;
      renameKey(model['narrative'].articles, media, newName);
      model['narrative'].medias[index] = newName;
    }
  }
  let runtime = Handlebars.compile(template);
  const output = runtime(model);
  fs.writeFileSync(README_PATH, output, 'utf-8');
  console.log('Generate README succeed!');
}

generate();
