const terminalIO = require('./terminalIO');
const runCli = require('./runCli');
const runPlop = require('./runPlop');
const confirmSystem = require('./confirmSystem');

const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

module.exports = {
    terminalIO,
    runCli,
    runPlop,
    confirmSystem,
    getAllFiles,
}