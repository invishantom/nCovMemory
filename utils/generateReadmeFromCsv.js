const path = require('path');
const Papa = require('papaparse');
const Handlebars = require('handlebars');
const { differenceInDays, parse, compareDesc } = require('date-fns');
var querystring = require('querystring');
var fs = require('fs-extra');

const ARCHIVE = require('../archive/index');
const DATA = require('../data/index');
const MEDIA_EN = require('../data/media_en.json');
const CATEGORY_TEXT = require('../template/category_text.json');
const ORDERING = require('../template/ordering.json');
const README_PATH = path.join(__dirname, '..', 'README.md');
const TEMPLATE_PATH = path.join(__dirname, '..', 'template', 'README.handlebars');

let model = new Map();

function getUniqueValue(arrayOfObject, property) {
  return arrayOfObject
    .map((a) => a[property])
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
}

Papa.parsePromise = function(file, options) {
  return new Promise(function(complete, error) {
    Papa.parse(file, { complete, error, ...options });
  });
};

// Escape Markdown Link
function escapeLink(string) {
  return (string = string.replace(/[\(|\)|（|）|<|>|《|》|【|】|\[|\]|、|\/]/g, '').toLowerCase());
}

Handlebars.registerHelper('link', escapeLink);

// Escape Markdown Table
function escapeTable(string) {
  return (string = string.replace(/\|/g, '\\|'));
}

Handlebars.registerHelper('table', escapeTable);

// Indicate Narratives
function indicateNarrative(string) {
  if (model.get('non_fiction').has(string)) {
    string = `${string}（个体）`;
  }
  return string;
}

Handlebars.registerHelper('narrative', indicateNarrative);

Handlebars.registerHelper('narrative_link', function(string) {
  return escapeLink(indicateNarrative(string));
});

function trimAttributes(object, attributes) {
  attributes.forEach((a) => {
    if (object.hasOwnProperty(a)) {
      a = a.trim();
    }
  });
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

  data.forEach((entry) => {
    entry.title = entry.title.trim();
    entry.title_en = entry.title_en.trim();

    entry.media = entry.media.trim();
    entry.is_new = differenceInDays(now, parse(entry.update, 'MM-dd', new Date())) <= 1;
    entry.is_deleted = entry.is_deleted === 'true' || entry.is_deleted === 'TRUE';
    if (ARCHIVE.hasOwnProperty(entry.id)) {
      entry = { ...ARCHIVE[entry.id], ...entry };
    }
  });

  let cats = getUniqueValue(data, 'category');
  cats.forEach((cat) => {
    let articlesOfCat = data.filter((d) => d.category === cat);
    let mediasOfCat = getUniqueValue(articlesOfCat, 'media');
    mediasOfCat.sort((a, b) => {
      let expectedOrderA = ORDERING[cat].indexOf(a);
      let expectedOrderB = ORDERING[cat].indexOf(b);
      return expectedOrderB - expectedOrderA;
    });
    let articlesByMedia = new Map();
    mediasOfCat.forEach((media) => {
      console.log(`Generating ${media} ...`);
      let articlesOfMedia = articlesOfCat
        .filter((d) => d.media === media)
        .sort((a, b) =>
          compareDesc(parse(a.date, 'MM-dd', new Date()), parse(b.date, 'MM-dd', new Date()))
        );
      articlesByMedia.set(media, articlesOfMedia);
    });
    model.set(CATEGORY_TEXT[cat], articlesByMedia);
  });

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  let runtime = Handlebars.compile(template);
  console.log(model);

  // // const output = runtime(model);
  // fs.writeFileSync(README_PATH, output, 'utf-8');
  console.log('Generate README succeed!');
}

generate();
