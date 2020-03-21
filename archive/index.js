var path = require('path');
const PUBLIC_PATH = 'https://github.com/2019ncovmemory/nCovMemory/blob/master/archive';
// const PUBLIC_PATH =
//   'https://github.com/2019ncovmemory/nCovMemory/tree/features/picture-compression/archive';
const fs = require('fs');
let index = {};
const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => 'isDirectory' in dirent && dirent.isDirectory())
    .map((dirent) => dirent.name);
let categories = getDirectories(__dirname);
for (category of categories) {
  fs.readdirSync(path.join(__dirname, category)).forEach((name) => {
    let id = name.replace(/\.\w*$/, '');
    index.hasOwnProperty(id) || (index[id] = {});
    index[id][category] = `${PUBLIC_PATH}/${category}/${name}`;
  });
}
module.exports = index;
