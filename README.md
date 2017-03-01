[![QQ Group](https://img.shields.io/badge/QQ%20Group-553406342-red.svg)]()
# JPush React Native Plugin

## 有关于 JPush SDK 的疑问，请务必到我们的[社区提问](https://community.jiguang.cn/)

## NOTE:
- for latest RN, use latest
- for jpush-react-native > 1.4.4, need install [jcore-react-native](https://github.com/jpush/jcore-react-native)
- 安装完 jcore 后，需要执行 react-native link, [详细过程参考这篇文章](http://bbs.reactnative.cn/topic/3505/%E7%94%A8-jpush-react-native-%E6%8F%92%E4%BB%B6%E5%BF%AB%E9%80%9F%E9%9B%86%E6%88%90%E6%8E%A8%E9%80%81%E5%8A%9F%E8%83%BD-android-%E7%AF%87)

## 自动配置（以下命令均在你的 React Native Project 目录下运行）
```
npm install jpush-react-native --save
npm install jcore-react-native --save ## jpush-react-native 1.4.2 版本以后需要同时安装 jcore-react-native

react-native link

//module name 指的是你 Android 项目中的模块名字(对 iOS 没有影响，不填写的话默认值为 app，会影响到查找 AndroidManifest 问题，
//如果没找到 AndroidManifest，则需要手动修改，参考下面的 AndroidManifest 配置相关说明)
npm run configureJPush <yourAppKey> <yourModuleName>

举个例子:
npm run configureJPush d4ee2375846bc30fa51334f5 app

```
**执行自动配置后仍然需要手动配置一下你项目模块下的 build.gradle 文件，参见手动配置中的 build.gradle 配置（后续版本可能会改进这一点）**

在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```
## 手动配置
```
npm install jpush-react-native --save
npm install jcore-react-native --save
react-native link
```
在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```

### Android

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




### Usage

- [Android Usage](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20Usage.md)
- [iOS Usage](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_Usage.md)

### API

- [Common](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Common.md)
- [Android API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20API.md)
- [iOS API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_API.md)
在 1.2.9 开始提供 OpenNotification 事件。获取点击通知事件，需要获得该条推送需要在 js 代码加入如下监听代码：（注意这个事件只有在 iOS 10之后才有）
```
var subscription = NativeAppEventEmitter.addListener(
  'OpenNotification',
  (notification) => console.log(notification)
);

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
- [pampang](https://github.com/pampang)
