var fs = require('fs');
var spath = require('path');
var os = require('os');

function getAllfiles(dir, findOne) {
  // if (arguments.length < 2) throw new TypeError('Bad arguments number');

  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function');
  }

  eachFileSync(spath.resolve(dir), findOne);
}

function eachFileSync (dir, findOne) {
  var stats = fs.statSync(dir);
  var files = fullPath(dir, fs.readdirSync(dir));
  files.forEach(function (item) {
    findOne(item, stats);
  });

  // // 遍历子目录
  // if (stats.isDirectory()) {
  //   var files = fullPath(dir, fs.readdirSync(dir));
  //   // console.log(dir);
  //   files.forEach(function (f) {
  //     // eachFileSync(f, findOne);
  //     findOne(dir, stats);
  //   });
  // }
}

function fullPath (dir, files) {
  return files.map(function (f) {
    return spath.join(dir, f);
  });
}

getPackageJson("./../..", function (f, s) {
  var isPackageJson = f.match(/package\.json/);
  if (isPackageJson != null) {
    console.log("find package.json file: " + f);
    if (isFile(f) == false) {
      console.log("configure package.json error!!");
      return;
    }
    var rf = fs.readFileSync(f, "utf-8");
    var searchKey = rf.match(/\n.*\"scripts\"\: \{\n/);

    if (/configureJPush/.test(rf)) {
      return;
    }

    if (searchKey != null) {
      rf = rf.replace(searchKey[0], searchKey[0] + "    \"configureJPush\"\: \"node node_modules\/jpush-react-native\/JPushConfiguration\.js\"\,\n");
      fs.writeFileSync(f, rf, "utf-8");
    }
  }
});

function getPackageJson(dir, findOne) {
  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function');
  }

  eachFileSync(spath.resolve(dir), findOne);
}

function isFile(path){
    return exists(path) && fs.statSync(path).isFile();
}

function exists(path){
     return fs.existsSync(path) || path.existsSync(path);
}

function isDir(path){
    return exists(path) && fs.statSync(path).isDirectory();
}
