var path = require('path');
// const PUBLIC_PATH = 'https://github.com/2019ncovmemory/nCovMemory/blob/master/archive';
const PUBLIC_PATH =
  'https://github.com/2019ncovmemory/nCovMemory/tree/features/picture-compression/archive';
const fs = require('fs');
let index = {};
const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
let cats = getDirectories(__dirname);
for (cat of cats) {
  fs.readdirSync(path.join(__dirname, cat)).forEach((name) => {
    let id = name.replace(/\.\w*$/, '');
    index.hasOwnProperty(id) || (index[id] = {});
    index[id][cat] = `${PUBLIC_PATH}/${cat}/${name}`;
  });
}
// console.log(index);

module.exports = index;
