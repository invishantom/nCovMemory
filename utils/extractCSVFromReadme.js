var fs = require('fs');
const path = require('path');
const { convertArrayToCSV } = require('convert-array-to-csv');

fs.readFile(path.join(__dirname, '..', 'README.md'), 'utf8', function(err, data) {
  if (err) throw err;
  let regex = /^\|\b(\d\d-\d\d)\|(.*)\|\[link]\((.*)\)\|\[link]\((.*)\)\|\[link]\((.*)\)\|$/gm;
  var match = regex.exec(data);
  let extracted = [];
  while ((match = regex.exec(data)) != null) {
    let indexHeader = data.slice(0, regex.lastIndex).lastIndexOf('###');
    let indexLinebreak = data.indexOf('\n', indexHeader);
    let media = data.slice(indexHeader + 4, indexLinebreak - 1);
    extracted.push([
      media,
      match[1],
      match[2],
      match[3],
      match[4].replace('articles', 'archive/png')
    ]);
  }
  var csv = convertArrayToCSV(extracted, {
    header: ['media', 'date', 'title', 'url', 'archive', 'screenshot'],
    separator: ','
  });
  // console.log(csv);
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'non-fiction.csv'), csv, 'utf-8');
});
