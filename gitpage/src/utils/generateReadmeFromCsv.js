import Papa from 'papaparse';
import Handlebars from 'handlebars';
import { differenceInDays, parse } from 'date-fns';

Papa.parsePromise = function(csv, options) {
  return new Promise(function(complete, error) {
    Papa.parse(csv, { complete, error, ...options });
  });
};

export default async function(csv, template) {
  let data = await Papa.parsePromise(csv, { header: true });
  let now = new Date();
  data.data.map((entry) => {
    entry.is_new = differenceInDays(now, parse(entry.update, 'MM-dd', new Date())) <= 0;
    entry.is_deleted = entry.is_deleted === 'true' || entry.is_deleted === 'TRUE';
  });
  data.data.map((entry) => {
    entry.screenshot = `/archive/png/${entry.screenshot}.png`;
  });
  let medias = [];
  for (let entry of data.data) {
    if (medias.indexOf(entry.media) === -1) {
      medias.push(entry.media);
    }
  }
  let articles = {};
  for (let media of medias) {
    articles[media] = data.data.filter((entry) => entry.media === media);
  }
  let model = {
    medias,
    articles
  };
  // let output = Mustache.render(template, model);
  let runtime = Handlebars.compile(template);
  const output = runtime(model);
  return output;
}
