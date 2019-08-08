[![tag](https://img.shields.io/badge/tag-1.6.7-blue.svg)](https://github.com/jpush/jpush-react-native/releases)
[![QQ Group](https://img.shields.io/badge/QQ%20Group-553406342-red.svg)]()

# JPush React Native Plugin

[English Document](README_en.md)

## 安装

```
npm install jpush-react-native jcore-react-native --save
```

## 配置

#### 1. iOS 手动操作部分 （3 个步骤）

- 在 iOS 工程中设置 TARGETS-> BUILD Phases -> LinkBinary with Libraries 找到 UserNotifications.framework 把 status 设为 optional
- 在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下路径

```
$(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule
```

- 在 xcode8 之后需要点开推送选项： TARGETS -> Capabilities -> Push Notification 设为 on 状态

#### 2. Android 手动操作部分 （3 个步骤）

- 修改 app 下的 build.gradle 配置：

  > your react native project/android/app/build.gradle

  ```java
  android {
      defaultConfig {
          applicationId "yourApplicationId"
          ...
          manifestPlaceholders = [
                  JPUSH_APPKEY: "yourAppKey",         //在此替换你的APPKey
                  JPUSH_CHANNEL: "developer-default"  //在此替换你的channel
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
  同时在AndridManifest.xml中添加如下代码
  ```
        <meta-data
            android:name="JPUSH_CHANNEL"
            android:value="${JPUSH_CHANNEL}" />
        <meta-data
            android:name="JPUSH_APPKEY"
            android:value="${JPUSH_APPKEY}" />
  ```

- 修改setting.gradle配置：

  ```java
  include ':jpush-react-native'
  project(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')
  include ':jcore-react-native'
  project(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')
  ```

  **操作完成后点击AndroidStudio的构建**

- 在Application中添加JPush

  ```java
  public class MainApplication extends Application implements ReactApplication {
  
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }
  
      @Override
      protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        //建议在调试期间将参数都设置为true，便于调试
        packages.add(new JPushPackage(true,true));
        return packages;
      }
  
      @Override
      protected String getJSMainModuleName() {
        return "index";
      }
    };
    
     @Override
    	public void onCreate() {
      	super.onCreate();
      	SoLoader.init(this, /* native exopackage */ false);
  			//强烈建议在Application初始化时调用原生接口的init方法
      	JPushInterface.init(this);
    	}
  }  
  ```

  

### API

**Android v1.6.6 版本后新增 notifyJSDidLoad，请务必在接收事件之前调用此方法。**

- [API](documents/api_en.md)

### 关于点击通知跳转到指定界面

- Android v1.6.7 新增 API `jumpToPushActivity`，使用参考 [demo](example/App.js#L113)

## [常见问题](./documents/common_problems.md)

------

## 贡献者列表

- [bang88](https://github.com/bang88)
- [pampang](https://github.com/pampang)
- [huhuanming](https://github.com/huhuanming)
- [arniu](https://github.com/arniu)

