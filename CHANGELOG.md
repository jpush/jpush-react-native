## 3.2.8 (2026-07-28)

- Android：JPush SDK 6.1.0 → 6.2.0，配套 JCore SDK 5.5.0。
- iOS：JPush SDK 6.1.0 → 6.2.0，配套 JCore SDK 5.5.0。
- `jcore-react-native` 最低版本调整为 2.3.7。
- Android：新增 `requestSubscribeChannel(channelIds)` JS API，结果通过 `addCommandEventListener` 的 `command === 2012` 事件返回。

## 3.2.7 (2026-05-09)

Upgrade JPush Android SDK to 6.1.0 and iOS SDK to 6.1.0; add setBackgroundEnable (Android) and getKeepLongConnInBackground (Android Only)

# Changelog

## [3.2.6] - 2026-02-06

### Changed
- **iOS**：改为通过 CocoaPods 自动集成 JPush SDK（`JPushRN.podspec` 中 `s.dependency 'JPush','6.0.0'`）
  更新插件版本后，请 cd 到 ios项目下，运行以下命令

  ```
  pod repo update
  pod install
  ```

- **Android**：改为通过 Gradle 自动集成 JPush SDK（`android/build.gradle` 中 `implementation 'cn.jiguang.sdk:jpush:6.0.1'`）
- **Android**：从该版本开始，不需要配置以下内容 
  
  ```
  * AndroidManifest.xml  (从插件3.2.6版本开始，不需要配置该内容)

  <meta-data
  	android:name="JPUSH_CHANNEL"
  	android:value="${JPUSH_CHANNEL}" />
  <meta-data
  	android:name="JPUSH_APPKEY"
  	android:value="${JPUSH_APPKEY}" />    

  ```


## [3.2.2] - 2026-01-27

### Added
- 更新iOS JPush SDK到6.0.0版本
- 更新Android JPush SDK到6.0.1版本
- 新增 `getPushStatus` 方法，用于检查推送是否被停止的状态（推荐使用，替代已废弃的 `isPushStopped` 方法）
  - iOS: 支持获取推送状态，返回结果码和是否停止的状态
  - Android: 支持获取推送状态，返回结果码和是否停止的状态

### Changed
- 插件版本从3.2.1升级到3.2.2

### Notes
- iOS SDK 6.0.0新增了 `getPushStatus` 接口
- Android SDK 6.0.0新增了 `getPushStatus` 接口，并废弃了 `isPushStopped` 接口（但仍保留以保持向后兼容）
- Android SDK 6.0.1主要更新了厂商推送SDK版本和厂商通道Token回调接口
