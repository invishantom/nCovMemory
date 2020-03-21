const path = require('path');
var fs = require('fs-extra');

const Papa = require('papaparse');
const Handlebars = require('handlebars');
const { differenceInDays, parse, compareDesc, format } = require('date-fns');
var querystring = require('querystring');

const ARCHIVE = require('../archive/index');
const { DATA } = require('../data/index');
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
  return (string = string
    .replace(/[\(|\)|（|）|<|>|《|》|【|】|\[|\]|、|\/|,|，|\.|。]/g, '')
    .replace(/\s/g, '-')
    .toLowerCase());
}

Handlebars.registerHelper('link', escapeLink);

// Escape Markdown Table
function escapeTable(string) {
  return (string = string.replace(/\|/g, '\\|'));
}

Handlebars.registerHelper('table', escapeTable);

function parseDate(a) {
  return parse(a, 'yyyy-MM-dd', new Date());
}

async function generate(language, template, path) {
  let viewModel = new Map();
  const TEXTS = LANGUAGES[language];
  let now = new Date();

  // Read csv & filter valid data
  let { data } = await Papa.parsePromise(DATA.data, { header: true });
  if (language !== 'cn') {
    data = data.filter((entry) => entry.title_en);
  }

  // Calculate attributes
  data = data.map((entry) => {
    entry.is_new = differenceInDays(now, parseDate(entry.update)) <= 1;
    entry.is_deleted = entry.is_deleted === 'true' || entry.is_deleted === 'TRUE';
    if (ARCHIVE.hasOwnProperty(entry.id)) {
      entry = { ...ARCHIVE[entry.id], ...entry };
    }
    return entry;
  });
  console.log(data);

  // Organize & sort data
  let categories = Object.keys(ORDERING);
  categories.forEach((category) => {
    let articlesOfCat = data.filter((d) => d.category === category);
    // extract index of the category
    let mediasOfCat = getUniqueValue(articlesOfCat, 'media').sort((a, b) => {
      let expectedOrderA = ORDERING[category].indexOf(a);
      let expectedOrderB = ORDERING[category].indexOf(b);
      return expectedOrderA - expectedOrderB;
    });
    let articlesGroupedByMedia = new Map();
    mediasOfCat.forEach((media) => {
      let articlesOfMedia = articlesOfCat.filter((d) => d.media === media);
      articlesOfMedia
        .sort((a, b) => compareDesc(parseDate(a.date), parseDate(b.date)))
        .forEach((article) => (article.date = format(parseDate(article.date), 'MM-dd')));
      // Set the displayed name of media
      let mediaName;
      switch (language) {
        case 'cn':
          mediaName = media;
          break;
        default:
          mediaName = TEXTS.media[media];
          break;
      }
      if (
        category === 'narrative' &&
        data.find((d) => d.category === 'non_fiction' && d.media === media)
      ) {
        mediaName += TEXTS.media['NARRATIVE_INDICATOR'];
      }

      articlesGroupedByMedia.set(mediaName, articlesOfMedia);
    });
    articlesGroupedByMedia = articlesGroupedByMedia.toObject();

    // Set the displayed name of category
    let categoryName;
    switch (category) {
      case 'non_fiction':
        categoryName = TEXTS.category.NON_FICTION;
        break;
      case 'narrative':
        categoryName = TEXTS.category.NARRATIVE;
        break;
    }
    viewModel.set(categoryName, articlesGroupedByMedia);
  });
  viewModel = viewModel.toObject();

  let runtime = Handlebars.compile(template);
  fs.writeFileSync(path, runtime(viewModel), 'utf-8');
  console.log(`Generate ${language} README succeed!`);
}

generate('cn', TEMPLATE, README_PATH);
// generate('en', TEMPLATE_EN, README_EN_PATH);
