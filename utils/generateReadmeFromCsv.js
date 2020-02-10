const path = require('path');
const Papa = require('papaparse');
const Handlebars = require('handlebars');
const { differenceInDays, parse, compareDesc } = require('date-fns');
var querystring = require('querystring');
var fs = require('fs-extra');
const ARCHIVE = require('../archive/index');
const README_PATH = path.join(__dirname, '..', 'README.md');
const DATA = require('../data/index');
const ORDERING = require('../template/ordering.json');
const TEMPLATE_PATH = path.join(__dirname, '..', 'template', 'README.handlebars');

Papa.parsePromise = function(file, options) {
  return new Promise(function(complete, error) {
    Papa.parse(file, { complete, error, ...options });
  });
};
let model = {
  narrative: { articles: {}, medias: [] },
  non_fiction: { articles: {}, medias: [] }
};
Handlebars.registerHelper('link', function(string) {
  // return encodeURIComponent(string);
  return (string = string.replace(/[\(|\)|（|）|<|>|《|》|【|】|\[|\]|、|\/]/g, '').toLowerCase());
});
Handlebars.registerHelper('table', function(string) {
  return (string = string.replace(/\|/g, '\\|'));
});
Handlebars.registerHelper('narrative', function(string) {
  if (Object.keys(model['non_fiction'].articles).indexOf(string) !== -1) {
    string = `${string}（个体）`;
  }
  return string;
});
Handlebars.registerHelper('narrative_link', function(string) {
  if (Object.keys(model['non_fiction'].articles).indexOf(string) !== -1) {
    string = `${string}（个体）`;
  }
  return (string = string.replace(/[\(|\)|（|）|<|>|《|》|【|】|\[|\]|、|\/]/g, '').toLowerCase());
});
function renameKey(o, old_key, new_key) {
  if (old_key !== new_key) {
    Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
    delete o[old_key];
  }
}

async function generate() {
  let now = new Date();
  let csv = fs.readFileSync(DATA['data'].path, 'utf8');
  // Read csv
  let { data } = await Papa.parsePromise(csv, { header: true });
  data = data.filter(
    (entry) =>
      entry.id && entry.category && entry.title && entry.media && entry.date && entry.update
  );
  // Extract medias and articles
  for (let entry of data) {
    // Calculate attributes
    entry.title = entry.title.trim();
    entry.media = entry.media.trim();
    entry.is_new = differenceInDays(now, parse(entry.update, 'MM-dd', new Date())) <= 1;
    entry.is_deleted = entry.is_deleted === 'true' || entry.is_deleted === 'TRUE';
    if (ARCHIVE.hasOwnProperty(entry.id)) {
      entry = { ...ARCHIVE[entry.id], ...entry };
    }
    if (!model[entry.category].articles[entry.media]) {
      model[entry.category].articles[entry.media] = [];
    }
    model[entry.category].articles[entry.media].push(entry);
  }

  // Sort
  for (let cat in model) {
    let orderedArticles = {};
    for (let expectedMedia of ORDERING[cat]) {
      console.log(`Generating ${expectedMedia} ...`);
      orderedArticles[expectedMedia] = model[cat].articles[expectedMedia];
      delete model[cat].articles[expectedMedia];
    }
    orderedArticles = Object.assign(model[cat].articles, orderedArticles);
    for (let media in orderedArticles) {
      orderedArticles[media].sort((a, b) =>
        compareDesc(parse(a.date, 'MM-dd', new Date()), parse(b.date, 'MM-dd', new Date()))
      );
    }
    // model[cat].medias.sort(function compareFunction(param1, param2) {
    //   return param1.localeCompare(param2, 'zh');
    // });
    model[cat].articles = orderedArticles;
    model[cat].medias = Object.keys(model[cat].articles);
  }

  // for (media in model['narrative'].articles) {
  //   if (Object.keys(model['non_fiction'].articles).indexOf(media) !== -1) {
  //     renameKey(model['narrative'].articles, media, `${media}（个体）`);
  //   }
  // }
  model['narrative'].medias = Object.keys(model['narrative'].articles);

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  let runtime = Handlebars.compile(template);
  const output = runtime(model);
  fs.writeFileSync(README_PATH, output, 'utf-8');
  console.log('Generate README succeed!');
}

generate();
