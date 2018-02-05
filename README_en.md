[![QQ Group](https://img.shields.io/badge/QQ%20Group-553406342-red.svg)]()

# JPush React Native Plugin

## NOTE:

* for latest RN, use latest
* for jpush-react-native > 1.4.4, require install [jcore-react-native](https://github.com/jpush/jcore-react-native)

## Install

```
npm install jpush-react-native jcore-react-native --save
```

## Configure

Configuration contains two steps, auto configuration part and manual cofiguration part.

### 1.Auto configuration part（Run this command in your React Native Project directory）

* Run script command

```
npm run configureJPush <yourAppKey> <yourModuleName>
// module name corresponds your Android Module name in your project.
// No effect to iOS，default value is "app"，this value is the key to find your AndroidManifest.xml，
// If not found AndroidManifest.xml，you need modify manually, please refer the manual part.
// For example:
npm run configureJPush d4ee2375846bc30fa51334f5 app
```

* Link project

```
react-native link
```

Input `appKey` for JPush and that's all.

If you want to know what auto configuration script does, see [The codes iOS auto configuration script adds](documents/ios_usage.md) for detail, otherwise ignore this.

### 2.Manual configuration part(After auto configure, you need modify specific files manually)

#### iOS part （Three steps）

* In iOS project, TARGETS-> BUILD Phases -> LinkBinary with Libraries find **UserNotifications.framework**, change status to optional.

* Add codes to TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths, if auto configuration script can't find header file.

```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule/RCTJPushModule
```

* Xcode8 or later, you need turn Push Nofication on. TARGETS -> Capabilities -> Push Notification turn on this option.

#### Android part （Three steps）

* Modify your build.gradle in you Android module：

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

* [Check configuration to see if matchs](documents/check_en.md)
* [Add JPushPackage](documents/android_usage.md)

### API

* [Common](documents/common.md)
* [Android API](documents/android_api.md)
* [iOS API](documents/ios_api.md)

---

### Contributors

* [bang88](https://github.com/bang88)
* [pampang](https://github.com/pampang)
