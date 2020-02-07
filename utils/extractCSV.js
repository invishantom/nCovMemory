var fs = require('fs');
const { convertArrayToCSV } = require('convert-array-to-csv');

fs.readFile('../README.md', 'utf8', function(err, data) {
  if (err) throw err;
  let regex = /^\|\b(\d\d-\d\d)\|(.*)\|\[link]\((.*)\)\|\[link]\((.*)\)\|\[link]\((.*)\)\|$/gm;
  var match = regex.exec(data);
  let extracted = [];
  while ((match = regex.exec(data)) != null) {
    extracted.push([match[1], match[2], match[3], match[4]]);
  }
  var csv = convertArrayToCSV(extracted, {
    header: ['date', 'title', 'url', 'archive', 'screenshot'],
    separator: ','
  });
  console.log(csv);
  fs.writeFileSync('./data.csv', csv, 'utf-8');
});
