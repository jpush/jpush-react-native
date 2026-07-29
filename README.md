# JPush-React-Native

## ChangeLog

1. 从RN-JPush2.7.5开始，重新支持TypeScript
2. 由于RN-JCore1.6.0存在编译问题，从RN-JCore1.7.0开始，还是需要在AndroidManifest.xml中添加配置代码，具体参考 配置-2.1 Android


## 1. 安装

```
npm install jpush-react-native --save
```

* 注意：如果项目里没有jcore-react-native，需要安装

  ```
  npm install jcore-react-native --save
  ```
安装完成后连接原生库
进入到根目录执行<br/>
react-native link<br/>
或<br/>
react-native link jpush-react-native<br/>
react-native link jcore-react-native

## 2. 配置

### 2.1 Android

* build.gradle

  ```
  android {
        defaultConfig {
            applicationId "yourApplicationId"           //在此替换你的应用包名
            ...
            manifestPlaceholders = [
                    JPUSH_APPKEY: "yourAppKey",         //在此替换你的APPKey
                    JPUSH_CHANNEL: "yourChannel"        //在此替换你的channel
            ]
        }
    }
  ```

  ```
  dependencies {
        ...
        implementation project(':jpush-react-native')  // 添加 jpush 依赖
        implementation project(':jcore-react-native')  // 添加 jcore 依赖
    }
  ```

* setting.gradle

  ```
  include ':jpush-react-native'
  project(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')
  include ':jcore-react-native'
  project(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')
  ```


* AndroidManifest.xml  (从插件3.2.6版本开始，不需要配置该内容)

  ```
  <meta-data
  	android:name="JPUSH_CHANNEL"
  	android:value="${JPUSH_CHANNEL}" />
  <meta-data
  	android:name="JPUSH_APPKEY"
  	android:value="${JPUSH_APPKEY}" />    
  ```

### 2.2 iOS
注意：您需要打开ios目录下的.xcworkspace文件修改您的包名

### 2.2.1 pod

```
pod install
```

* 注意：如果项目里使用pod安装过，请先执行命令

  ```
  pod deintegrate
  ```

### 2.2.2 手动方式

* Libraries

  ```
  Add Files to "your project name"
  node_modules/jcore-react-native/ios/RCTJCoreModule.xcodeproj
  node_modules/jpush-react-native/ios/RCTJPushModule.xcodeproj
  ```

* Capabilities

  ```
  Push Notification --- ON
  ```

* Build Settings

  ```
  All --- Search Paths --- Header Search Paths --- +
  $(SRCROOT)/../node_modules/jcore-react-native/ios/RCTJCoreModule/
  $(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/
  ```

* Build Phases

  ```
  libz.tbd
  libresolv.tbd
  UserNotifications.framework
  libRCTJCoreModule.a
  libRCTJPushModule.a
  ```

## 3. 引用

### 3.1 Android

参考：[MainApplication.java](https://github.com/jpush/jpush-react-native/tree/master/example/android/app/src/main/java/com/example/MainApplication.java)

### 3.2 iOS

参考：[AppDelegate.m](https://github.com/jpush/jpush-react-native/tree/master/example/ios/example/AppDelegate.mm) 

### 3.3 js

参考：[App.js](https://github.com/jpush/jpush-react-native/blob/dev/example/App.js) 

## 4. API

详见：[index.js](https://github.com/jpush/jpush-react-native/blob/master/index.js)

### 4.1 Android 请求订阅厂商通知通道

JPush Android SDK 6.2.0 起支持请求订阅厂商通知通道。当前仅支持已集成并注册小米通道的小米设备，且调用时应用需处于前台、屏幕已点亮。

```javascript
const commandListener = result => {
  if (result.command === 2012) {
    const channelResults = result.openChannelResult
      ? JSON.parse(result.openChannelResult)
      : [];
    console.log(result.commandResult, result.platform, channelResults);
  }
};

JPush.addCommandEventListener(commandListener);
JPush.requestSubscribeChannel(["YOUR_XIAOMI_CHANNEL_ID"]);

// 页面销毁时移除监听
JPush.removeListener(commandListener);
```

- `channelIds`：在小米后台审核通过的订阅类 channel ID 数组，单次最多处理 3 个。
- `commandResult`：请求结果码；`0` 表示正常拉起弹窗并返回用户操作结果。
- `openChannelResult`：各 channel 处理结果的 JSON 数组字符串，例如 `[{"channelId":"xxx","code":100}]`。
- `platform`：厂商平台，当前小米为 `1`。
- 回调命令固定为 `command === 2012`。弹窗 30 秒内最多拉起一次，同一 channel 每月最多拉起两次。

`commandResult` 常见结果码：

- `0`：正常拉起弹窗并返回用户操作结果。
- `-100`：当前版本不支持；`-200`：鉴权失败；`-300`：应用不在前台或屏幕未点亮。
- `-500`：触发频控；`-700`：用户取消；`-800`：应用没有通知权限。

`openChannelResult` 中每个 channel 的 `code`：`100` 成功，`-100` 失败，
`-200` 用户拒绝，`-300` 已存在且开启，`-400` 已存在但关闭，`-500` channel ID 非法。

## 5.  其他

* 集成前务必将example工程跑通
* 如有紧急需求请前往[极光社区](https://community.jiguang.cn/c/question)
* 上报问题还麻烦先调用JPush.setLoggerEnable(true}，拿到debug日志

 
