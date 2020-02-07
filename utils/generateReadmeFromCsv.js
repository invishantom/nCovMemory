const Papa = require('papaparse');
// const Mustache = require('Mustache');
const Handlebars = require('handlebars');

const path = require('path');

var fs = require('fs');

fs.readFile(path.join(__dirname, '..', 'data', 'non-fiction.csv'), 'utf8', function(err, csv) {
  Papa.parse(csv, {
    header: true,
    complete: function(data) {
      data.data.pop();
      fs.readFile(path.join(__dirname, '..', 'template', 'README.handlebars'), 'utf8', function(
        err,
        template
      ) {
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
});
