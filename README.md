[![QQ Group](https://img.shields.io/badge/QQ%20Group-553406342-red.svg)]()
# JPush React Native Plugin

## 有关于 JPush SDK 的疑问，请务必到我们的[社区提问](https://community.jiguang.cn/)

## NOTE:
- for latest RN, use latest
- for jpush-react-native > 1.4.4, require install [jcore-react-native](https://github.com/jpush/jcore-react-native)
- 安装完 jcore 后，需要执行自动配置脚本，如果出错了，需要手动配置一下，[详细过程参考这篇文章](http://bbs.reactnative.cn/topic/3505/%E7%94%A8-jpush-react-native-%E6%8F%92%E4%BB%B6%E5%BF%AB%E9%80%9F%E9%9B%86%E6%88%90%E6%8E%A8%E9%80%81%E5%8A%9F%E8%83%BD-android-%E7%AF%87)
## 安装
```
npm install jpush-react-native --save
npm install jcore-react-native --save ## jpush-react-native 1.4.2 版本以后需要同时安装 jcore-react-native
react-native link
```
## 配置
配置有两种方式，分为自动配置和手动配置。其中自动配置并非为全自动（以后版本或许会改进），还是需要部分手动操作。这里推荐使用自动配置
### 自动配置（以下命令均在你的 React Native Project 目录下运行，自动配置失败后需要手动配置）
```
npm run configureJPush <yourAppKey> <yourModuleName>

//module name 指的是你 Android 项目中的模块名字(对 iOS 没有影响，不填写的话默认值为 app，会影响到查找 AndroidManifest 问题，
//如果没找到 AndroidManifest，则需要手动修改，参考下面的 AndroidManifest 配置相关说明)
```
举个例子:
```
npm run configureJPush d4ee2375846bc30fa51334f5 app
```
在 iOS 工程中设置 TARGETS-> BUILD Phases -> LinkBinary with Libraries 找到 UserNotifications.framework 把 status 设为 optional

在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```

在 xcode8 之后需要点开推送选项： TARGETS -> Capabilities -> Push Notification 设为 on 状态
### 手动配置(自动配置后，部分操作需要手动修改) 
#### iOS
在 iOS 工程中设置 TARGETS-> BUILD Phases -> LinkBinary with Libraries 找到 UserNotifications.framework 把 status 设为 optional

在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```
在 xcode8 之后需要点开推送选项： TARGETS -> Capabilities -> Push Notification 设为 on 状态

还需要手动添加 Native 代码，具体看 👉 [文档](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_Usage.md)
#### Android

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

将此处的 yourApplicationId 替换为你的项目的包名；yourAppKey 替换成你在官网上申请的应用的 AppKey，检查一下 dependencies 中有没有添加 jpush-react-native 及 jcore-react-native 这两个依赖。


- 检查 android 项目下的 settings.gradle 配置有没有包含一下内容：

> settings.gradle

```
include ':app', ':jpush-react-native', ':jcore-react-native'
project(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')
project(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')

```

- 检查一下 app 下的 AndroidManifest 配置，有没有增加 \<meta-data> 部分。

> your react native project/android/app/AndroidManifest.xml

```
    <application
        ...
        <!-- Required . Enable it you can get statistics data with channel -->
        <meta-data android:name="JPUSH_CHANNEL" android:value="${APP_CHANNEL}"/>
        <meta-data android:name="JPUSH_APPKEY" android:value="${JPUSH_APPKEY}"/>

    </application>
```

- 现在重新 sync 一下项目，应该能看到 jpush-react-native 以及 jcore-react-native 作为 android Library 项目导进来了。

- [加入 JPushPackage](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20Usage.md)


### API

- [Common](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Common.md)
- [Android API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20API.md)
- [iOS API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_API.md)


### [关于更新 RN](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Update%20React%20Native.md)

---
贡献者列表
- [bang88](https://github.com/bang88)
- [pampang](https://github.com/pampang)
