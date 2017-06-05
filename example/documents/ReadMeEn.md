[![QQ Group](https://img.shields.io/badge/QQ%20Group-553406342-red.svg)]()
# JPush React Native Plugin


## NOTE:
- for latest RN, use latest
- for jpush-react-native > 1.4.4, require install [jcore-react-native](https://github.com/jpush/jcore-react-native)

## Install
```
npm install jpush-react-native --save
npm install jcore-react-native --save ## jpush-react-native 1.4.2 or later need install jcore-react-native as well.

```
## Configure
Configuration contains two steps, auto configuration part and manual cofiguration part.
### 1.Auto configuration part（Run this command in your React Native Project directory）

- Run script command
```
npm run configureJPush <yourAppKey> <yourModuleName>
// module name corresponds your Android Module name in your project.
// No effect to iOS，default value is "app"，this value is the key to find your AndroidManifest.xml，
// If not found AndroidManifest.xml，you need modify manually, please refer the manual part.
// For example:
npm run configureJPush d4ee2375846bc30fa51334f5 app
```

- Link project
```
// run this command after running script command.
react-native link
```
If you want to know what auto configuration script does, see [The codes iOS auto configuration script adds](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_Usage.md) for detail, otherwise ignore this.

### 2.Manual configuration part(After auto configure, you need modify specific files manually) 
#### iOS part （Three steps）
- In iOS project, TARGETS-> BUILD Phases -> LinkBinary with Libraries find **UserNotifications.framework**, change status to optional.

- Add codes to TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths, if auto configuration script can't find header file.
```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```
- Xcode8 or later, you need turn Push Nofication on. TARGETS -> Capabilities -> Push Notification turn on this option.

#### Android part （Three steps）
- Modify your build.gradle in you Android module：

> your react native project/android/app/build.gradle

```
android {
    defaultConfig {
        // add this if not exists.
        applicationId "yourApplicationId"  // change to your package name.
        ...
        manifestPlaceholders = [
                JPUSH_APPKEY: "yourAppKey", // change to your appKey value.
                APP_CHANNEL: "developer-default"    // default value.
        ]
    }
}
...
dependencies {
    compile fileTree(dir: "libs", include: ["*.jar"])
    compile project(':jpush-react-native')  // add jpush dependency
    compile project(':jcore-react-native')  // add jcore dependency
    compile "com.facebook.react:react-native:+"  // From node_modules
}
```

Change yourApplicationId to your actual package name；change yourAppKey to your AppKey apply from our website.

- [Check configuration to see if matchs](https://github.com/jpush/jpush-react-native/blob/master/example/documents/CheckEn.md)
- [Add JPushPackage](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20Usage.md)


### API

- [Common](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Common.md)
- [Android API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Android%20API.md)
- [iOS API](https://github.com/jpush/jpush-react-native/blob/master/example/documents/iOS_API.md)


### [About update React Native](https://github.com/jpush/jpush-react-native/blob/master/example/documents/Update%20React%20Native.md)

---
贡献者列表
- [bang88](https://github.com/bang88)
- [pampang](https://github.com/pampang)
