const path = require('path');
var fs = require('fs-extra');

const Papa = require('papaparse');
const Handlebars = require('handlebars');
const { differenceInDays, parse, compareDesc } = require('date-fns');
var querystring = require('querystring');

const ARCHIVE = require('../archive/index');
const { DATA, MEDIA_TRANSLATION } = require('../data/index');
const { TEMPLATE, TEMPLATE_EN, ORDERING, LANGUAGES } = require('../template/index');
const README_EN_PATH = path.join(__dirname, '..', 'README-en.md');
const README_PATH = path.join(__dirname, '..', 'README.md');

Map.prototype.toObject = function() {
  const obj = {};
  this.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
};

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

function trimAttributes(object, attributes) {
  attributes.forEach((a) => {
    if (object.hasOwnProperty(a) && object[a]) {
      object[a] = object[a].trim();
    }
  });
}

async function generate(language, template, path) {
  let model = new Map();
  const TEXTS = LANGUAGES[language];
  let now = new Date();
  // Read csv
  let { data } = await Papa.parsePromise(DATA.data, { header: true });
  data = data.filter(
    (entry) =>
      entry.id && entry.category && entry.title && entry.media && entry.date && entry.update
  );
  if (language !== 'cn') {
    data = data.filter((entry) => entry.title_en);
  }

  // Process data
  data.forEach((entry) => {
    trimAttributes(entry, ['title', 'title_en', 'media']);
    entry.is_new = differenceInDays(now, parse(entry.update, 'MM-dd', new Date())) <= 1;
    entry.is_deleted = entry.is_deleted === 'true' || entry.is_deleted === 'TRUE';
    if (ARCHIVE.hasOwnProperty(entry.id)) {
      entry = { ...ARCHIVE[entry.id], ...entry };
    }
    if (
      entry.cat === 'narrative' &&
      data.find((v) => v.cat === 'non_fiction' && v.media === entry.media)
    ) {
      entry.need_indicator = true;
    } else {
      entry.need_indicator = false;
    }
  });

  // Organize & sort data
  let cats = ['non_fiction', 'narrative'];
  cats.forEach((cat) => {
    let articlesOfCat = data.filter((d) => d.category === cat);
    let mediasOfCat = getUniqueValue(articlesOfCat, 'media').sort((a, b) => {
      let expectedOrderA = ORDERING[cat].indexOf(a);
      let expectedOrderB = ORDERING[cat].indexOf(b);
      return expectedOrderA - expectedOrderB;
    });
    let articlesGroupedByMedia = new Map();
    mediasOfCat.forEach((media) => {
      let articlesOfMedia = articlesOfCat
        .filter((d) => d.media === media)
        .sort((a, b) =>
          compareDesc(parse(a.date, 'MM-dd', new Date()), parse(b.date, 'MM-dd', new Date()))
        );
      let mediaText;
      switch (language) {
        case 'cn':
          mediaText = media;
          break;
        default:
          mediaText = MEDIA_TRANSLATION[language][media];
          break;
      }
      if (
        cat === 'narrative' &&
        data.find((d) => d.category === 'non_fiction' && d.media === media)
      ) {
        mediaText += TEXTS['NARRATIVE_INDICATOR'];
      }
      articlesGroupedByMedia.set(mediaText, articlesOfMedia);
    });
    articlesGroupedByMedia = articlesGroupedByMedia.toObject();
    model.set(TEXTS[cat], articlesGroupedByMedia);
  });
  model = model.toObject();
  let runtime = Handlebars.compile(template);
  fs.writeFileSync(path, runtime(model), 'utf-8');
  console.log('Generate README succeed!');
}

generate('cn', TEMPLATE, README_PATH);
generate('en', TEMPLATE_EN, README_EN_PATH);
