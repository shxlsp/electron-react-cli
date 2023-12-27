const path = require('path');
const entryDir = path.join(__dirname, '../src');
const electronDirName = 'main';
const commonDirName = 'common';
const prodMode = 'production';

const webpackType = {
  electron: 'electron',
  react: 'react',
};

module.exports = {
  entryDir,
  electronDirName,
  prodMode,
  webpackType,
  commonDirName,
};
