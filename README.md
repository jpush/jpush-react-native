[![QQ Group](https://img.shields.io/badge/QQ%20Group-553406342-red.svg)]()
# JPush React Native Plugin

[English Document](https://github.com/jpush/jpush-react-native/blob/master/example/documents/ReadMeEn.md)

## 有关于 JPush SDK 的疑问，请务必到我们的[社区提问](https://community.jiguang.cn/)

## NOTE:
- for latest RN, use latest
- for jpush-react-native > 1.4.4, require install [jcore-react-native](https://github.com/jpush/jcore-react-native)
- 安装完 jcore 后，需要执行自动配置脚本，如果出错了，需要手动配置一下，[详细过程参考这篇文章](http://bbs.reactnative.cn/topic/3505/%E7%94%A8-jpush-react-native-%E6%8F%92%E4%BB%B6%E5%BF%AB%E9%80%9F%E9%9B%86%E6%88%90%E6%8E%A8%E9%80%81%E5%8A%9F%E8%83%BD-android-%E7%AF%87)
## 安装
```
npm install jpush-react-native --save
npm install jcore-react-native --save ## jpush-react-native 1.4.2 版本以后需要同时安装 jcore-react-native

```
## 配置
配置包括两个步骤，自动配置和手动操作。
### 1.自动配置部分（以下命令均在你的 React Native Project 目录下运行，自动配置后仍需手动配置一部分）

- 执行脚本
```
npm run configureJPush <yourAppKey> <yourModuleName>
//module name 指的是你 Android 项目中的模块名字(对 iOS 没有影响，不填写的话默认值为 app，会影响到查找 AndroidManifest 问题，
//如果没找到 AndroidManifest，则需要手动修改，参考下面的 AndroidManifest 配置相关说明)
//举个例子:
npm run configureJPush d4ee2375846bc30fa51334f5 app
```

- Link 项目
```
//执行自动配置脚本后再执行 link 操作
react-native link
```
自动配置操作会自动插入 Native 代码，这个部分用户无需关系具体细节，如果实在想了解加入代码的细节可以查看如下链接
- [iOS 自动配置后自动添加的代码](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_Usage.md)

### 2.手动操作部分(自动配置后，部分操作需要手动修改) 
#### iOS 手动操作部分 （3个步骤）
- 在 iOS 工程中设置 TARGETS-> BUILD Phases -> LinkBinary with Libraries 找到 UserNotifications.framework 把 status 设为 optional

- 在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下路径
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```
- 在 xcode8 之后需要点开推送选项： TARGETS -> Capabilities -> Push Notification 设为 on 状态

#### Android 手动操作部分 （3个步骤）
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
    compile project(':jpush-react-native')  // 添加 jpush 依赖
    compile project(':jcore-react-native')  // 添加 jcore 依赖
    compile "com.facebook.react:react-native:+"  // From node_modules
}
```

将此处的 yourApplicationId 替换为你的项目的包名；yourAppKey 替换成你在官网上申请的应用的 AppKey。

- [检查添加的配置项](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Check.md)

- [加入 JPushPackage](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20Usage.md)


### API

- [Common](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Common.md)
- [Android API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20API.md)
- [iOS API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_API.md)

### 关于点击通知跳转到指定界面
demo 增加了 [JPushModuleDemo](./example/android/app/src/com/pushdemo/JPushModuleDemo.java) 类（其中点击通知的地方做了一下跳转），
可以在应用处于前台，后台或者为启动状态时，点击通知跳转到指定界面（SecondActivity）。
对应的 JS 文件为 [second.js](./example/react-native-android/second.js)，详情可以参考这两个文件。


### [关于更新 RN](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Update%20React%20Native.md)

---
贡献者列表
- [bang88](https://github.com/bang88)
- [pampang](https://github.com/pampang)
