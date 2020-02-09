var path = require('path');
// const PUBLIC_PATH = 'https://github.com/2019ncovmemory/nCovMemory/blob/master/archive';
const PUBLIC_PATH =
  'https://github.com/2019ncovmemory/nCovMemory/tree/features/picture-compression/archive';
const fs = require('fs');
let index = {};

let cats = fs.readdirSync(__dirname).filter((cat) => cat !== 'index.js');
for (cat of cats) {
  fs.readdirSync(path.join(__dirname, cat)).forEach((name) => {
    let id = name.replace(/\.\w*$/, '');
    index.hasOwnProperty(id) || (index[id] = {});
    index[id][cat] = `${PUBLIC_PATH}/${cat}/${name}`;
  });
}
// console.log(index);

module.exports = index;
