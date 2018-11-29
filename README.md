[![tag](https://img.shields.io/badge/tag-1.6.7-blue.svg)](https://github.com/jpush/jpush-react-native/releases)
[![QQ Group](https://img.shields.io/badge/QQ%20Group-553406342-red.svg)]()

# JPush React Native Plugin

[English Document](README_en.md)

## 注意:

* jpush-react-native 自 1.4.4 之后, 需要安装 [jcore-react-native](https://github.com/jpush/jcore-react-native)
* 安装完后，需要执行 `react-native link`。如果出错了，无需惊慌，手动配置一下即可，具体可参考这篇[文章](http://bbs.reactnative.cn/topic/3505/%E7%94%A8-jpush-react-native-%E6%8F%92%E4%BB%B6%E5%BF%AB%E9%80%9F%E9%9B%86%E6%88%90%E6%8E%A8%E9%80%81%E5%8A%9F%E8%83%BD-android-%E7%AF%87)

## 安装

```
npm install jpush-react-native jcore-react-native --save
```
## 配置

配置包括两个步骤，自动配置和手动操作。

### 1.自动配置部分（以下命令均在你的 React Native Project 目录下运行）

如果工程不是通过 Cocoapods 来集成 ReactNative 的可以直接使用下面代码来 link 插件。
```
react-native link
```

根据提示，输入 `appKey` 等即可。

自动配置操作会自动插入 Native 代码（iOS 中使用 Appdelegate.m 文件名，如果修改了该文件名需要手动插入[代码](documents/ios_usage.md)），这个部分用户无需关系具体细节。



##### （如果是原生应用集成 react-native）使用 CocoaPods 安装

#####    如果你的 React Native 是通过 Cocoapods 来集成的则使用下面两个步骤来集成，注意： 使用 pod 就不要使用 react-native link 了，不然会有冲突。

1. 在 Podfile 中添加如下代码:

```
pod 'JPushRN', :path => '../node_modules/jpush-react-native'
```

2. 终端执行如下指令:

```
pod install
```

### 2.手动操作部分（自动配置后，部分操作需要手动修改）

#### iOS 手动操作部分 （3 个步骤）

* 在 iOS 工程中设置 TARGETS-> BUILD Phases -> LinkBinary with Libraries 找到 UserNotifications.framework 把 status 设为 optional

* 在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下路径

```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule
```

* 在 xcode8 之后需要点开推送选项： TARGETS -> Capabilities -> Push Notification 设为 on 状态

#### Android 手动操作部分 （3 个步骤）

* 修改 app 下的 build.gradle 配置：

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
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation project(':jpush-react-native')  // 添加 jpush 依赖
    implementation project(':jcore-react-native')  // 添加 jcore 依赖
    implementation "com.facebook.react:react-native:+"  // From node_modules
}
```

将此处的 yourApplicationId 替换为你的项目的包名；yourAppKey 替换成你在官网上申请的应用的 AppKey。

* [检查添加的配置项](documents/check.md)

* [加入 JPushPackage，有参数！](documents/android_usage.md)

### API

**Android v1.6.6 版本后新增 notifyJSDidLoad，请务必在接收事件之前调用此方法。**

* [API](documents/api_en.md)

### 关于点击通知跳转到指定界面

* Android v1.6.7 新增 API `jumpToPushActivity`，使用参考 [demo](example/App.js#L113)

## [常见问题](./documents/common_problems.md)

---

## 贡献者列表

* [bang88](https://github.com/bang88)
* [pampang](https://github.com/pampang)
* [huhuanming](https://github.com/huhuanming)
* [arniu](https://github.com/arniu)
