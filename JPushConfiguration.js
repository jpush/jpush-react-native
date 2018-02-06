/* eslint-disable */

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const questions = [
  {
    type: 'input',
    name: 'appKey',
    message: 'Input the appKey for JPush'
  },
  {
    type: 'input',
    name: 'moduleName',
    message: 'Input the module name of android',
    default: 'app'
  }
]

inquirer.prompt(questions).then(answers => {
  const { appKey, moduleName } = answers
  if (moduleName == undefined) {
    moduleName = "app"
  }

  //  深度遍历所有文件，
  getAllFiles('./ios', function(f, s) {
    var isAppdelegate = f.match(/AppDelegate\.m/)
    // 找到Appdelegate.m 文件 插入代码
    if (isAppdelegate != null) {
      console.log('the file is appdelegate:' + f)
      insertJPushCode(f, appKey)
    }
  })

  getAndroidManifest('./android/' + moduleName, function(f, s) {
    var isAndroidManifest = f.match(/AndroidManifest\.xml/)
    if (isAndroidManifest != null) {
      configureAndroidManifest(f)
    }
  })

  getConfigureFiles('./android', function(f, s) {
    // 找到settings.gradle
    var isSettingGradle = f.match(/settings\.gradle/)
    if (isSettingGradle != null) {
      console.log('find settings.gradle in android project ' + f)
      configureSetting(f, moduleName)
    }

    // 找到project下的build.gradle
    var isProjectGradle = f.match(/.*\/build\.gradle/)
    if (isProjectGradle != null) {
      console.log('find build.gradle in android project ' + f)
      configureGradle(f)
      configureAppKey(f, appKey)
    }
  })
})

function insertJPushCode(file, appKey) {
  // 这个是插入代码的脚本 install
  if (!isFile(file)) {
    console.log('configuration JPush error!!')
    return
  }

  var rf = fs.readFileSync(file, 'utf-8')
  // 删除所有的 JPush 相关代码  注册推送的没有删除，
  rf = rf.replace(/\n#import <RCTJPushModule.h>/, '')
  rf = rf.replace(/\n#ifdef NSFoundationVersionNumber_iOS_9_x_Max/, '')
  rf = rf.replace(/\n#import <UserNotifications\/UserNotifications\.h>/, '')
  rf = rf.replace(/\n#import <UserNotifications\/UserNotifications\.h>/, '')
  rf = rf.replace(/\n#endif/, '')
  rf = rf.replace(/\[JPUSHService registerDeviceToken:deviceToken\];\n/, '')

  // 插入 头文件
  rf = rf.replace(
    /#import "AppDelegate.h"/,
    '#import "AppDelegate.h"\n#import <RCTJPushModule.h>\n#ifdef NSFoundationVersionNumber_iOS_9_x_Max\n#import <UserNotifications/UserNotifications.h>\n#endif'
  )
  fs.writeFileSync(file, rf, 'utf-8')

  // 这个是删除代码的脚本 uninstall
  // var rf = fs.readFileSync(file,"utf-8");
  // rf = rf.replace(/#import "AppDelegate.h"[*\n]#import <RCTJPushModule.h>/,"\#import \"AppDelegate.h\"");
  // fs.writeFileSync(file, rf, "utf-8");

  // 插入 注册推送 和启动jpush sdk
  // - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
  // {
  var rf = fs.readFileSync(file, 'utf-8')
  var searchDidLaunch = rf.match(/\n.*didFinishLaunchingWithOptions.*\n?\{/)
  if (searchDidLaunch == null) {
    console.log('没有匹配到 didFinishLaunchingWithOptions,将自动插入改方法')
    console.log(rf)
  } else {
    // console.log(searchDidlaunch[0]);
    var oldValue = rf.match(/\[JPUSHService registerForRemoteNotificationTypes/)
    if (oldValue == null) {
      rf = rf.replace(
        searchDidLaunch[0],
        searchDidLaunch[0] +
        '\nJPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];\n     entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;\n     [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];\n\
[JPUSHService setupWithOption:launchOptions appKey:@"' +
        appKey +
        '"\n\
                    channel:nil apsForProduction:true];'
      )
      fs.writeFileSync(file, rf, 'utf-8')
    }
  }

  //  这个插入代码 didRegisterForRemoteNotificationsWithDeviceToken
  var rf = fs.readFileSync(file, 'utf-8')
  var search = rf.match(
    /\n.*didRegisterForRemoteNotificationsWithDeviceToken:\(NSData \*\)deviceToken[ ]*\{/
  )

  if (search == null) {
    console.log(
      '没有匹配到 函数 didRegisterForRemoteNotificationsWithDeviceToken,将自动插入改方法'
    )
    rf = rf.replace(
      /@end/,
      '- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {\n[JPUSHService registerDeviceToken:deviceToken];\n}\n@end'
    )
    // console.log(rf);
    fs.writeFileSync(file, rf, 'utf-8')
  } else {
    console.log(search[0])
    var oldValue = rf.match(/\[JPUSHService registerDeviceToken/)
    if (oldValue == null) {
      rf = rf.replace(
        search[0],
        search[0] + '\n[JPUSHService registerDeviceToken:deviceToken];'
      )
      fs.writeFileSync(file, rf, 'utf-8')
    } else {
      console.log('registerDeviceToken存在，不在插入')
    }
  }

  // 这里插入 didReceiveRemoteNotification
  var rf = fs.readFileSync(file, 'utf-8')
  var search = rf.match(
    /\n.*didReceiveRemoteNotification:\(NSDictionary \*\)userInfo[ ]*\{/
  )
  if (search == null) {
    console.log('没有匹配到 函数 didReceiveRemoteNotification,将自动插入改方法')
    rf = rf.replace(
      /@end/,
      '- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {\n[[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];\n}\n@end'
    )
    // console.log(rf);
    fs.writeFileSync(file, rf, 'utf-8')
  }

  // 这里插入 didReceiveRemoteNotification fetchCompletionHandler
  var rf = fs.readFileSync(file, 'utf-8')
  var search = rf.match(
    /\n.*didReceiveRemoteNotification:[ ]*\(NSDictionary \*\)[ ]*userInfo[ ]*fetchCompletionHandler:\(void[ ]*\(\^\)[ ]*\(UIBackgroundFetchResult\)\)completionHandler \{/
  )
  if (search == null) {
    console.log(
      '没有匹配到 函数 didReceiveRemoteNotification fetchCompletionHandler,将自动插入改方法'
    )
    rf = rf.replace(
      /\@end/,
      '- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {\n[[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];\n}\n@end'
    )
    // console.log(rf);
    fs.writeFileSync(file, rf, 'utf-8')
  }

  // 这里插入 willPresentNotification
  var rf = fs.readFileSync(file, 'utf-8')
  var search = rf.match(
    /\n.*willPresentNotification:\(UNNotification \*\)notification[ ]*withCompletionHandler:.*\{\n/
  )
  if (search == null) {
    console.log('没有匹配到 函数 willPresentNotification,将自动插入改方法')
    rf = rf.replace(
      /@end/,
      '- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {\n NSDictionary * userInfo = notification.request.content.userInfo;\n  [JPUSHService handleRemoteNotification:userInfo];\n [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];\n    \n completionHandler(UNNotificationPresentationOptionAlert);\n}\n@end'
    )
    fs.writeFileSync(file, rf, 'utf-8')
  }

  // 这里插入 didReceiveNotificationResponse
  var rf = fs.readFileSync(file, 'utf-8')
  var search = rf.match(
    /\n.*jpushNotificationCenter:\(UNUserNotificationCenter \*\)center[ ]*didReceiveNotificationResponse:\(UNNotificationResponse \*\)response.*\{\n/
  )
  if (search == null) {
    console.log('没有匹配到 函数 didReceiveRemoteNotification,将自动插入改方法')
    rf = rf.replace(
      /@end/,
      '- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {\nNSDictionary * userInfo = response.notification.request.content.userInfo;\n[JPUSHService handleRemoteNotification:userInfo];\n[[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];\n\ncompletionHandler();\n}\n@end'
    )
    // console.log(rf);
    fs.writeFileSync(file, rf, 'utf-8')
  }

  var rf = fs.readFileSync(file, 'utf-8')
  var search = rf.match(
    /\n.*didReceiveLocalNotification:\(UILocalNotification \*\)notification[ ]*\{/
  )
  if (search == null) {
    console.log('没有匹配到 函数 didReceiveLocalNotification,将自动插入改方法')
    rf = rf.replace(
      /@end/,
      '- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {\n[[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:notification.userInfo];\n}\n@end'
    )
    fs.writeFileSync(file, rf, 'utf-8')
  }
}

// 判断文件
function exists(file) {
  return fs.existsSync(file) || file.existsSync(file)
}

function isFile(file) {
  return exists(file) && fs.statSync(file).isFile()
}

// getAllfiles("./",function(f,s){
//   console.log(f);
//   var isAppdelegate = f.match(/AppDelegate\.m/);
//   var isiOSProjectPbxprojFile = f.match(/[.]*\.pbxproj/);
// });
// function to get all file
function getAllFiles(dir, findOne) {
  // if (arguments.length < 2) throw new TypeError('Bad arguments number');

  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function')
  }

  eachFileSync(path.resolve(dir), findOne)
}

function eachFileSync(dir, findOne) {
  var stats = fs.statSync(dir)
  findOne(dir, stats)

  // 遍历子目录
  if (stats.isDirectory()) {
    var files = fullPath(dir, fs.readdirSync(dir))
    // console.log(dir);
    files.forEach(function(f) {
      eachFileSync(f, findOne)
    })
  }
}

function fullPath(dir, files) {
  return files.map(function(f) {
    return path.join(dir, f)
  })
}

function getAndroidManifest(dir, findOne) {
  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function')
  }

  eachFileSync(path.resolve(dir), findOne)
}

function getConfigureFiles(dir, findOne) {
  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function')
  }

  eachFileSync(path.resolve(dir), findOne)
}

function configureAndroidManifest(file) {
  if (!isFile(file)) {
    console.log('configuration JPush error!!')
    return
  }

  var rf = fs.readFileSync(file, 'utf-8')
  var isAlreadyWrite = rf.match(/.*android:value="\$\{JPUSH_APPKEY\}"/)
  if (isAlreadyWrite == null) {
    var searchKey = rf.match(/\n.*<\/activity>/)
    if (searchKey != null) {
      rf = rf.replace(
        searchKey[0],
        searchKey[0] +
        '\n\n<meta-data android:name="JPUSH_CHANNEL" android:value="${APP_CHANNEL}"/>\n<meta-data android:name="JPUSH_APPKEY" android:value="${JPUSH_APPKEY}"/>\n'
      )
      fs.writeFileSync(file, rf, 'utf-8')
    }
  }
}

function configureAppKey(file, appKey) {
  if (!isFile(file)) {
    console.log('configure AppKey error!!')
    return
  }

  var rf = fs.readFileSync(file, 'utf-8')
  var isAlreadyWrite = rf.match(/.*JPUSH_APPKEY.*/)
  if (isAlreadyWrite == null) {
  var insertKey = rf.match(/.*versionName.*\n/)
    if (insertKey != null) {
      rf = rf.replace(
        insertKey[0],
        insertKey[0] +
        '        manifestPlaceholders = [\n            JPUSH_APPKEY: "' +
        appKey +
        '",\n            APP_CHANNEL: "developer-default"\n        ]\n'
      )
      fs.writeFileSync(file, rf, 'utf-8')
    } else {
      console.log('Configure appKey error, should configure manually.')
    }
  }
}

function configureSetting(file, moduleName) {
  if (!isFile(file)) {
    console.log('configuration JPush error!!')
    return
  }

  var rf = fs.readFileSync(file, 'utf-8')
  var isAlreadyWrite = rf.match(/.*jpush-react-native.*/)
  if (isAlreadyWrite == null) {
    var re = new RegExp("\n.*include.*':" + moduleName + "'", 'gi')
    var searchKey = rf.match(re)
    if (searchKey != null) {
      rf = rf.replace("\n", "\ninclude ':jpush-react-native' \nproject(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')\ninclude ':jcore-react-native' \nproject(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')\n")
      fs.writeFileSync(file, rf, 'utf-8')
    } else {
      console.log('Did not find include in settings.gradle: ' + file)
    }
  }
}

function configureGradle(file) {
  if (!isFile(file)) {
    console.log('configuration JPush error!!')
    return
  }

  var rf = fs.readFileSync(file, 'utf-8')
  var isAlreadyWrite = rf.match(/.*jpush-react-native.*/)
  if (isAlreadyWrite == null) {
    var searchKey = rf.match(/\n.*compile fileTree.*\n/)
    if (searchKey != null) {
      rf = rf.replace(
        searchKey[0],
        searchKey[0] +
        "    compile project(':jpush-react-native')\n    compile project(':jcore-react-native')\n"
      )
      fs.writeFileSync(file, rf, 'utf-8')
    } else {
      console.log('Did not find "compile" in ' + file)
    }
  }
}
