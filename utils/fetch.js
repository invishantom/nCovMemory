const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const awaitWriteStream = require('await-stream-ready').write;
const CSV_PATHS = require('../data/index');

async function build() {
  for (key in CSV_PATHS) {
    let file = fs.createWriteStream(CSV_PATHS[key].path);
    let response = await fetch(CSV_PATHS[key].fetch_url);
    await awaitWriteStream(response.body.pipe(file));
    console.log(`Fetch ${key} succeed!`);
  }
}
build();
