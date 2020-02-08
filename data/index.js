var path = require('path');
module.exports = {
  non_fiction: {
    path: path.join(__dirname, 'non-fiction.csv'),
    fetch_url:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnnYBgtWcb0VjocAYuwvQcZk1JJYS_Ok-NUj-Mbp75-FU47lUEmCZjm1mjOHeR2kf1TsOaDR4gz8PD/pub?gid=1097066541&single=true&output=csv'
  },
  narrative: {
    path: path.join(__dirname, 'narrative.csv'),
    fetch_url:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnnYBgtWcb0VjocAYuwvQcZk1JJYS_Ok-NUj-Mbp75-FU47lUEmCZjm1mjOHeR2kf1TsOaDR4gz8PD/pub?gid=719844158&single=true&output=csv'
  }
};
