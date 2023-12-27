const fs = require('fs');
const path = require('path');
const { electronDirName, entryDir } = require('../constant');

const readDir = (filePath) => {
  const res = fs.readdirSync(filePath, { withFileTypes: true });
  const dirList = [];
  res.forEach((item) => {
    if (item.isDirectory()) {
      dirList.push({
        path: path.join(filePath, item.name),
        name: item.name,
      });
    }
  });
  return dirList;
};

const getEntryList = (filePath) => {
  const res = fs.readdirSync(filePath, { withFileTypes: true });
  const entry = {};
  res.forEach((item) => {
    if (item.isDirectory()) {
      entry[item.name] = path.join(filePath, item.name);
    }
  });
  return entry;
};

const getModeConfig = (isProd, webpackType) => {
  if (isProd) {
    return webpackType === 'electron'
      ? {
          output: {
            libraryTarget: 'umd',
          },
        }
      : {};
  }
  return {
    watch: true,
    devtool: 'source-map',
    ...(webpackType === 'electron' ? {} : {}),
  };
};

// 复制文件
function copyFile(srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on('error', function (err) {
    if (err) {
      console.log('read error', srcPath);
    }
    cb && cb(err);
  });

  var ws = fs.createWriteStream(tarPath);
  ws.on('error', function (err) {
    if (err) {
      console.log('write error', tarPath);
    }
    cb && cb(err);
  });

  ws.on('close', function (ex) {
    cb && cb(ex);
  });

  rs.pipe(ws);
  console.log('复制文件完成', srcPath);
}

// 复制文件夹
function copyDir(srcDir, tarDir, cb) {
  if (fs.existsSync(tarDir)) {
    fs.readdir(srcDir, function (err, files) {
      var count = 0;
      var checkEnd = function () {
        console.log('进度', count);
        ++count == files.length && cb && cb();
      };

      if (err) {
        checkEnd();
        return;
      }

      files.forEach(function (file) {
        var srcPath = path.join(srcDir, file);
        var tarPath = path.join(tarDir, file);

        fs.stat(srcPath, function (err, stats) {
          if (stats.isDirectory()) {
            fs.mkdir(tarPath, function (err) {
              if (err) {
                console.log(err);
                return;
              }

              copyDir(srcPath, tarPath, checkEnd);
              console.log('复制文件完成', srcPath);
            });
          } else {
            copyFile(srcPath, tarPath, checkEnd);
            console.log('复制文件完成', srcPath);
          }
        });
      });

      //为空时直接回调
      files.length === 0 && cb && cb();
    });
  } else {
    fs.mkdir(tarDir, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('创建文件夹', tarDir);
      copyDir(srcDir, tarDir, cb);
    });
  }
}

const movePreloads = (cb) => {
  const perloadsDirName = 'preloads';
  const readFilePath = path.join(entryDir, electronDirName, perloadsDirName);
  const distPath = path.resolve(__dirname, '../../dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdir(distPath, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('创建文件夹', distPath);
    });
  }
  const writeFilePath = path.resolve(__dirname, '../../dist', perloadsDirName);
  copyDir(readFilePath, writeFilePath, () => console.log('复制完成'));
};

const getPreLoadsEntry = () => {
  const perloadsDirName = 'preloads';
  const readFilePath = path.join(entryDir, electronDirName, perloadsDirName);
  const res = fs.readdirSync(readFilePath, { withFileTypes: true });
  const entry = {};
  res.forEach((item) => {
    // entry[item.name.split('.')[0]] = path.join(readFilePath, item.name);
    entry[`${perloadsDirName}/${item.name.split('.')[0]}`] = path.join(readFilePath, item.name);
  });
  delete entry['preloads/modules'];
  console.log(entry);
  return entry;
};

module.exports = {
  readDir,
  getEntryList,
  getModeConfig,
  getPreLoadsEntry,
  movePreloads,
};
