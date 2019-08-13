module.exports = {
  dependency : {
    platforms: {
      android: {
        "packageImportPath": "import cn.jpush.reactnativejpush.JPushPackage;"
      }
    },
    hooks: {
      prelink: './scripts/patch.js'
    },
  }
};
