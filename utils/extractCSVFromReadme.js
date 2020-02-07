const fs = require('fs');
const path = require('path');
const { convertArrayToCSV } = require('convert-array-to-csv');
const README_PATH = path.join(__dirname, 'README-backup.md');
const NON_FICTION_PATH = path.join(__dirname, '..', 'data', 'non-fiction.csv');

let data = fs.readFileSync(README_PATH, 'utf8');
let regex = /^\|\b(\d\d-\d\d)\|(.*)\|\[link]\((.*)\)\|\[link]\((.*)\)\|\[link]\((.*)\)\|?$/gm;
var match = regex.exec(data);
let extracted = [];
while ((match = regex.exec(data)) != null) {
  let indexHeader = data.slice(0, regex.lastIndex).lastIndexOf('###');
  let indexLinebreak = data.indexOf('\n', indexHeader);
  let media = data.slice(indexHeader + 4, indexLinebreak);
  extracted.push([
    '02-06',
    media,
    match[1].trim(),
    match[2].trim(),
    match[3].trim(),
    null,
    match[4]
      .trim()
      .replace(/articles\/\w*\//, '')
      .replace('.png', ''),
    match[5].trim()
  ]);
}
let csv = convertArrayToCSV(extracted, {
  header: ['update', 'media', 'date', 'title', 'url', 'is_deleted', 'screenshot', 'archive'],
  separator: ','
});
csv = csv.slice(0, -1);
// let medias = [];
// for (entry of extracted) {
//   if (medias.indexOf(entry[0]) === -1) {
//     medias.push(entry[0]);
//   }
// }
// for (media of medias) {
//   let csv = convertArrayToCSV(
//     extracted.filter((entry) => entry[0] === media),
//     {
//       header: ['media', 'date', 'title', 'url', 'screenshot', 'archive'],
//       separator: ','
//     }
//   );
// console.log(csv);
fs.writeFileSync(path.join(NON_FICTION_PATH), csv, 'utf-8');
