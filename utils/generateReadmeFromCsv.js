const path = require('path');
const Papa = require('papaparse');
const Handlebars = require('handlebars');
const { differenceInDays, parse, compareDesc } = require('date-fns');
var querystring = require('querystring');
var fs = require('fs-extra');
const ARCHIVE = require('../archive/index');
const README_PATH = path.join(__dirname, '..', 'README.md');
const DATA = require('../data/index');

Papa.parsePromise = function(file, options) {
  return new Promise(function(complete, error) {
    Papa.parse(file, { complete, error, ...options });
  });
};

Handlebars.registerHelper('link', function(string) {
  // return encodeURIComponent(string);
  return (string = string.replace(/[\(|\)|（|）|<|>|《|》|【|】|\[|\]|、|\/]/g, '').toLowerCase());
});
Handlebars.registerHelper('table', function(string) {
  return (string = string.replace(/\|/g, '\\|'));
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

async function generate() {
  let model = {
    narrative: { articles: {}, medias: [] },
    non_fiction: { articles: {}, medias: [] }
  };
  let now = new Date();
  let csv = fs.readFileSync(DATA['data'].path, 'utf8');
  // Read csv
  let { data } = await Papa.parsePromise(csv, { header: true });
  data = data.filter(
    (entry) => entry.id && entry.title && entry.media && entry.date && entry.update && entry.url
  );
  // Extract medias and articles
  for (let entry of data) {
    // Calculate attributes
    entry.is_new = differenceInDays(now, parse(entry.update, 'MM-dd', new Date())) <= 1;
    entry.is_deleted = entry.is_deleted === 'true' || entry.is_deleted === 'TRUE';
    if (ARCHIVE.hasOwnProperty(entry.id)) {
      entry = { ...ARCHIVE[entry.id], ...entry };
    }
    if (entry.category === 'narrative' && model['non_fiction'].medias.indexOf(entry.media) !== -1) {
      entry.media = `${entry.media}（个体）`;
    }
    if (model[entry.category].medias.indexOf(entry.media) === -1) {
      model[entry.category].medias.push(entry.media);
    }
    if (!model[entry.category].articles[entry.media]) {
      model[entry.category].articles[entry.media] = [];
    }
    model[entry.category].articles[entry.media].push(entry);
  }
  // Sort
  for (let cat in model) {
    model[cat].medias.sort(function compareFunction(param1, param2) {
      return param1.localeCompare(param2, 'zh');
    });
    let orderedArticles = {};
    for (media of model[cat].medias) {
      orderedArticles[media] = model[cat].articles[media];
      orderedArticles[media].sort(
        (a, b) =>
          compareDesc(
            parse(a.update, 'MM-dd', new Date()),
            parse(b.update, 'MM-dd', new Date())
          ) !== 1
      );
      model.articles = orderedArticles;
    }
  }

  let template = fs.readFileSync(
    path.join(__dirname, '..', 'template', 'README.handlebars'),
    'utf8'
  );
  let runtime = Handlebars.compile(template);
  const output = runtime(model);
  fs.writeFileSync(README_PATH, output, 'utf-8');
  console.log('Generate README succeed!');
}

generate();
