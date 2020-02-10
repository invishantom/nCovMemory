var child = require('child_process');
var CronJob = require('cron').CronJob;
const DATA = require('../data/index');
var diff = require('diff');
var fs = require('fs');
var path = require('path');
let execAsync = function(command, cwd) {
  return new Promise((resolve, reject) => {
    child.exec(command, { detached: true, windowsHide: true, cwd }, (e, o, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(o);
      }
    });
  });
};

var job = new CronJob(
  '*/15 * * * * *',
  async function() {
    let oldCsv = fs.readFileSync(DATA['data'].path, 'utf8');
    await execAsync('yarn fetch');
    let newCsv = fs.readFileSync(DATA['data'].path, 'utf8');
    if (oldCsv !== newCsv) {
      await execAsync('yarn build');
      await execAsync('yarn deploy');
    }
  },
  null,
  true,
  'America/Los_Angeles'
);
job.start();
