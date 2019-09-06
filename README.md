# JPush-React-Native

## 1. 安装

```
npm install jpush-react-native --save
```

* 注意：如果项目里没有jcore-react-native，需要安装

```
npm install jcore-react-native --save
```

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

* AndridManifest.xml

```
<meta-data
	android:name="JPUSH_CHANNEL"
  android:value="${JPUSH_CHANNEL}" />
<meta-data
  android:name="JPUSH_APPKEY"
  android:value="${JPUSH_APPKEY}" />
```

* setting.gradle

```
include ':jpush-react-native'
  project(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')
  include ':jcore-react-native'
  project(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')
```

###2.2 iOS
