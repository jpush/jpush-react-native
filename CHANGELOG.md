# Changelog

## [3.2.4] - 2026-02-06

### Changed
- **iOS**：改为通过 CocoaPods 自动集成 JPush SDK（`JPushRN.podspec` 中 `s.dependency 'JPush','6.0.1'`）
- **Android**：改为通过 Gradle 自动集成 JPush SDK（`android/build.gradle` 中 `implementation 'cn.jiguang.sdk:jpush:6.0.1'`）
- 插件版本从 3.2.2 升级到 3.2.4


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
