const Papa = require('papaparse');
// const Mustache = require('Mustache');
const Handlebars = require('handlebars');
const { differenceInDays, parse } = require('date-fns');
const path = require('path');
const README_PATH = path.join(__dirname, '..', 'README.md');
const NON_FICTION_PATH = path.join(__dirname, '..', 'data', 'non-fiction.csv');
var fs = require('fs');

let csv = fs.readFileSync(path.join(__dirname, '..', 'data', 'non-fiction.csv'), 'utf8');
Papa.parse(csv, {
  header: true,
  complete: function(data) {
    // if (data.data[data.data.length - 1].media === '') {
    //   data.data.pop();
    // }
    let now = new Date();
    data.data.map((entry) => {
      entry.is_new = differenceInDays(now, parse(entry.update, 'MM-dd', new Date())) <= 0;
    });
    fs.readFile(path.join(__dirname, '..', 'template', 'README.handlebars'), 'utf8', function(
      err,
      template
    ) {
      data.data.map((entry) => {
        entry.screenshot = `/archive/png/${entry.screenshot}.png`;
      });

      let medias = [];
      for (entry of data.data) {
        if (medias.indexOf(entry.media) === -1) {
          medias.push(entry.media);
        }
      }
      let articles = {};
      for (media of medias) {
        articles[media] = data.data.filter((entry) => entry.media === media);
      }
      let model = {
        medias,
        articles
      };
      // let output = Mustache.render(template, model);
      let runtime = Handlebars.compile(template);
      const output = runtime(model);
      fs.writeFileSync(path.join(__dirname, '..', 'README.md'), output, 'utf-8');
    });
  }
});
