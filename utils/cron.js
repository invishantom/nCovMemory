var child = require('child_process');
var CronJob = require('cron').CronJob;
const DATA = require('../data/index');
var diff = require('diff');
var fs = require('fs');
let execAsync = function(command) {
  return new Promise((resolve, reject) => {
    child.exec(command, (e, o, err) => {
      if (e || err) {
        reject(err);
      } else {
        resolve(o);
      }
    });
  });
};

var job = new CronJob(
  '*/5 * * * * *',
  async function() {
    let oldCsv = fs.readFileSync(DATA['data'].path, 'utf8');
    await execAsync('yarn fetch');
    let newCsv = fs.readFileSync(DATA['data'].path, 'utf8');
    if (oldCsv !== newCsv) {
      await execAsync('git add .');
      await execAsync('git commit -m "automatic build"');
    }
  },
  null,
  true,
  'America/Los_Angeles'
);
job.start();
