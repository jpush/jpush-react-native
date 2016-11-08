# JPush React Native Plugin

**v1.2.3 版本后需要注意 Android 方面的配置（因为把 APPKey 的设置从 nodule_modules 中移出来了），
执行自动配置后仍然需要手动配置一下你项目模块下的 build.gradle 文件，参见手动配置中的 build.gradle 配置（后续版本可能会改进这一点）**

##自动配置（以下命令均在你的 React Native Project 目录下运行）
```
npm install jpush-react-native --save

rnpm link jpush-react-native

//module name 指的是你 Android 项目中的模块名字(不填写的话默认值为 app，会影响到查找 AndroidManifest 问题，
//如果没找到 AndroidManifest，则需要手动修改，参考下面的 AndroidManifest 配置相关说明)
npm run configureJPush <yourAppKey> <yourModuleName>

举个例子:
npm run configureJPush d4ee2375846bc30fa51334f5 app

```

## 手动配置
```
npm install jpush-react-native --save
rnpm link jpush-react-native
```

###Android

- 使用 Android Studio import 你的 React Native 应用（选择你的 React Native 应用所在目录下的 android 文件夹即可）

- 修改 android 项目下的 settings.gradle 配置：

> settings.gradle

```
include ':app', ':jpush-react-native'
project(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')

```

- 修改 app 下的 AndroidManifest 配置，将 jpush 相关的配置复制到这个文件中，[参考 demo 的 AndroidManifest](https://github.com/jpush/jpush-react-native/blob/master/example/android/app/AndroidManifest.xml)：(增加了 \<meta-data> 部分)

> your react native project/android/app/AndroidManifest.xml

```
    <application
        android:name=".MainApplication"
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />

        <!-- Required . Enable it you can get statistics data with channel -->
        <meta-data android:name="JPUSH_CHANNEL" android:value="${APP_CHANNEL}"/>
        <meta-data android:name="JPUSH_APPKEY" android:value="${JPUSH_APPKEY}"/>

    </application>
```

- 修改 app 下的 build.gradle 配置：

> your react native project/android/app/build.gradle

```
android {
    defaultConfig {
        applicationId "yourApplicationId"
        ...
        manifestPlaceholders = [
                JPUSH_APPKEY: "yourAppKey", //在此替换你的APPKey
                APP_CHANNEL: "developer-default"    //应用渠道号
        ]
    }
}
...
dependencies {
    compile fileTree(dir: "libs", include: ["*.jar"])
    compile project(':jpush-react-native')
    compile "com.facebook.react:react-native:+"  // From node_modules
}
```

将此处的 yourApplicationId 替换为你的项目的包名；yourAppKey 替换成你在官网上申请的应用的 AppKey。到此为止，配置完成。

- 现在重新 sync 一下项目，应该能看到 jpush-react-native 作为一个 android Library 项目导进来了

![](https://github.com/KenChoi1992/SomeArticles/blob/master/screenshots/plugin1.png)


### 使用

##### RN 0.29.0 以下版本
- 打开 app 下的 MainActivity，在 ReactInstanceManager 的 build 方法中加入 JPushPackage：

> app/MainActivity.java

![](https://github.com/KenChoi1992/SomeArticles/blob/master/screenshots/plugin3.png)


##### RN 0.29.0 以上版本
- 打开 app 下的 MainApplication.java 文件，然后加入 JPushPackage，[参考 demo](https://github.com/jpush/jpush-react-native/blob/master/example/android/app/src/com/pushdemo/MainApplication.java):

> app/MainApplication.java

```
    private boolean SHUTDOWN_TOAST = false;
    private boolean SHUTDOWN_LOG = false;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }


        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
            );
        }
    };
```

- 在 JS 中 import JPushModule，然后即可调用相关方法，[参考 demo](https://github.com/jpush/jpush-react-native/blob/master/example/react-native-android/push_activity.js)：
```
import JPushModule from 'jpush-react-native';

...

componentDidMount() {
    JPushModule.addReceiveCustomMsgListener((message) => {
      this.setState({pushMsg: message});
    });
    JPushModule.addReceiveNotificationListener((message) => {
      console.log("receive notification: " + message);
    })
  }

  componentWillUnmount() {
    JPushModule.removeReceiveCustomMsgListener();
    JPushModule.removeReceiveNotificationListener();
  }
```


关于 JPushModule 中的提供调用方法可以参考 jpush-react-native 文件夹下的 index.js 文件，此处将方法罗列如下：

- initPush()
- getInfo(map)
```
JPushModule.getInfo((map) => {
      this.setState({
            appkey: map.myAppKey,
            imei: map.myImei,
            package: map.myPackageName,
            deviceId: map.myDeviceId,
            version: map.myVersion
      });
    });
```
- stopPush()
- resumePush()
- setTag(array, callback, callback)
- getRegistrationID(callback)
- setAlias(alias, callback, callback)
- setStyleBasic()
- setStyleCustom()
- addReceiveCustomMsgListener(callback)
- removeReceiveCustomMsgListener(event)
- addReceiveNotificationListener(callback)
```
JPushModule.addReceiveNotificationListener((map) => {
      console.log("alertContent: " + map.alertContent);
      console.log("extras: " + map.extras);
      // var extra = JSON.parse(map.extras);
      // console.log(extra.key + ": " + extra.value);
});
```
- removeReceiveNotificationListener(event)
- addOpenNotificationListener(callback)
```
JPushModule.addReceiveOpenNotificationListener((map) => {
      console.log("Opening notification!");
      //自定义点击通知后打开某个 Activity，比如跳转到 pushActivity
      this.props.navigator.jumpTo({name: "pushActivity"});
    });
```
- removeOpenNotificationListener(event)

**关于接口的使用请[参考 demo](https://github.com/jpush/jpush-react-native/tree/master/example/react-native-android)，下载 zip 后解压，使用 Android Studio 打开，修改 AndroidManifest， AppKey 以及 gradle 相关配置（主要是平台版本号），然后在终端中使用命令 react-native run-android 运行，JS 用法可以参考 PushDemo/react-native-android 文件夹下的文件**


####iOS Usage
- 打开 iOS 工程，在 rnpm link 之后，RCTJPushModule.xcodeproj 工程会自动添加到 Libraries 目录里面
- 在 iOS 工程 target 的 Build Phases->Link Binary with Libraries 中加入如下库
    - libz.tbd
    - CoreTelephony.framework
    - Security.framework
    - CFNetwork.framework 
    - CoreFoundation.framework
    - SystemConfiguration.framework
    - Foundation.framework
    - UIKit.framework
    - UserNotifications.framework
    - libresolv.tbd
- 在 AppDelegate.h 文件中 填写如下代码，这里的的 appkey、channel、和 isProduction 填写自己的
```
static NSString *appKey = @"";     //填写appkey
static NSString *channel = @"";    //填写channel   一般为nil
static BOOL isProduction = false;  //填写isProdurion  平时测试时为false ，生产时填写true
```
- 在AppDelegate.m 的didFinishLaunchingWithOptions 方法里面添加如下代码
```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    //可以添加自定义categories
    [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                      UIUserNotificationTypeSound |
                                                      UIUserNotificationTypeAlert)
                                          categories:nil];
  } else {
    //iOS 8以前 categories 必须为nil
    [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                      UIRemoteNotificationTypeSound |
                                                      UIRemoteNotificationTypeAlert)
                                          categories:nil];
  }
  
  [JPUSHService setupWithOption:launchOptions appKey:appKey
                        channel:channel apsForProduction:isProduction];
}
```
- 在AppDelegate.m 的didRegisterForRemoteNotificationsWithDeviceToken 方法中添加 [JPUSHService registerDeviceToken:deviceToken]; 如下所示
```
- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}
```
- 为了在收到推送点击进入应用能够获取该条推送内容需要在 AppDelegate.m didReceiveRemoteNotification 方法里面添加 [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo] 方法，注意：这里需要在两个方法里面加一个是iOS7以前的一个是iOS7即以后的，如果AppDelegate.m 没有这个两个方法则直接复制这两个方法；如下所示
```
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  // 取得 APNs 标准信息内容
  
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}
//iOS 7 Remote Notification
- (void)application:(UIApplication *)application didReceiveRemoteNotification:  (NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
  
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}
```
然后在 js 代码里面通过如下回调获取通知
```
var { NativeAppEventEmitter } = require('react-native');

var subscription = NativeAppEventEmitter.addListener(
  'ReceiveNotification',
  (notification) => console.log(notification)
);
...
// 千万不要忘记忘记取消订阅, 通常在componentWillUnmount函数中实现。
subscription.remove();
```
- JPush 提供应用内消息，用户可以发送应用内消息给应用，如果手机应用在前台就会收到这个消息，否则存为离线消息。我们可以通过如下代码获取这个应用内消息
```
var { NativeAppEventEmitter } = require('react-native');

var subscription = NativeAppEventEmitter.addListener(
  'networkDidReceiveMessage',
  (message) => console.log(message)
);
...
// 千万不要忘记忘记取消订阅, 通常在componentWillUnmount函数中实现。
subscription.remove();
```

###关于更新 React Native

**进入当前项目的目录**
- 在命令行中使用：

> react-native --version

就可以查看当前使用的版本

- 在命令行中输入：

> npm info react-native

就可以查看 React Native 的历史和最新版本

- React Native可以直接更新到某个版本：

> npm install --save react-native@0.23.0

就可以更新到0.23.0版本

如果升级后出现类似于
```
react-native@0.23.0 requires a peer of react@^0.14.5 but none was installed.
```

执行:
> npm install --save react

或者：
> npm install --save react@0.14.5

即可。

如果更新后执行 react-native run-android 不能正确运行，而是出现类似：
```
 Could not find com.facebook.react:react-native:0.23.0.
```

错误，或者在 Android Studio 中直接运行 app 时报错：
```
Android Studio failed to resolve com.facebook.react:react-native:0.23.0
```

那么可以按照下列命令修复，首先在命令行中执行：
> npm i

执行完毕且不报错后，执行下面的命令，**注意，在执行命令之后，某些文件可能会产生冲突，请确保你的本地文件记录可以恢复**（在 Android Studio 中可以查看历史记录来恢复文件）
> react-native upgrade

执行上面的命令可能会提示你是否覆盖文件。在解决冲突之后重新运行 App 即可。

---
贡献者列表
- [bang88](https://github.com/bang88)
