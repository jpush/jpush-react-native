---
name: update-sdk
description: |
  更新 jpush-react-native 插件的 JPush SDK 版本。自动拉取极光官网 Changelog，分析新增/移除/变更 API，更新 Android（Maven）、iOS（CocoaPods）版本引用，同步更新 Native 层（Java/ObjC）和 Bridge 层（JS/TS）代码，展示变更摘要确认后发布到 npm。
  Use when: 更新 JPush SDK、升级推送 SDK 版本、jpush-react-native 发布新版本、RN 插件 SDK 更新。
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - WebFetch
---

你正在更新 **jpush-react-native** 插件。

**用户参数：** $ARGUMENTS

---

## 第一步：解析参数

从 `$ARGUMENTS` 中提取版本号：
- `--android X.X.X` → Android JPush SDK 目标版本
- `--ios X.X.X` → iOS JPush SDK 目标版本

如果某端版本号缺失，先询问用户再继续。

---

## 第二步：安装依赖

```bash
pip3 install requests beautifulsoup4 -q 2>&1 | tail -1
```

---

## 第三步：拉取 SDK Changelog

```bash
python3 .claude/skills/update-sdk/scripts/changelog_fetcher.py --android <ANDROID_VERSION> --ios <IOS_VERSION>
```

读取 `.claude/skills/update-sdk/scripts/.changelog_cache.json` 获取 Changelog 内容。

---

## 第四步：AI 分析变更

基于 Changelog，分析并整理：

> **注意**：Changelog 同时包含 JPush 和 JCore 的变更。只关注调用类以 `JPush` 开头的条目，忽略类名以 `JCore` 开头的内容。

1. **新增 API**：同时存在于 Android 和 iOS 的功能 → 合并为一个插件统一 API；仅单端有的 → **先检查另一端是否已有等价实现**（见下方说明），确认缺失才标注平台注释（`// Android only` / `// iOS only`）
2. **移除/废弃 API**：确认是否需要从插件中删除或标记 `@deprecated`
3. **行为变更**：影响现有封装逻辑的改动
4. **新插件版本号**：始终升 patch（如 3.4.9 → 3.5.0，3.9.9 → 4.0.0）

> **跨平台等价检查**：当 Changelog 只在某一端出现新增 API 时，**不要直接标为单端 Only**。先读取另一端的 Native 文件（`android/src/.../JPushModule.java` 或 `ios/RCTJPushModule/RCTJPushModule.m`）和 Bridge 层（`index.js`），搜索功能相同或名称相近的方法。如果另一端已有对应实现，则合并为统一 API；只有确认另一端完全没有等价功能时，才标注 Android Only / iOS Only。

输出结构化变更计划后再执行后续步骤。

---

## 第五步：更新版本号引用

```bash
python3 .claude/skills/update-sdk/scripts/plugin_updater.py \
  --android <ANDROID_VERSION> \
  --ios <IOS_VERSION> \
  --bump-patch \
  --changelog-summary "<ONE_LINE_SUMMARY>"
```

---

## 第六步：更新 Native 层代码

**编写代码前，先通过 WebFetch 查询官网 API 文档，确认新增方法的完整签名、参数类型和返回值：**
- Android 文档：`https://docs.jiguang.cn/jpush/client/Android/android_api`
- iOS 文档：`https://docs.jiguang.cn/jpush/client/iOS/ios_api`

在文档中搜索第四步识别出的新增方法名，确认签名后再编写下方代码。

根据第四步的变更计划，编辑以下文件：

**Android** — `android/src/main/java/cn/jiguang/plugins/push/JPushModule.java`
- 为每个新增 API 添加对应的 `@ReactMethod` 方法，内部调用 `JPushInterface.newMethod()`

**iOS** — `ios/RCTJPushModule/RCTJPushModule.m`
- 为每个新增 API 添加对应的 `RCT_EXPORT_METHOD` 块

移除 API：若 SDK 已完全删除则移除封装方法，若仅废弃则保留并添加 `@deprecated` 注释。

---

## 第七步：更新 Bridge 层代码

**JavaScript** — `index.js`
- 为每个新增 API 添加对应的导出函数，调用 `NativeModules.JPushModule.newMethod()`

**TypeScript 类型** — `index.d.ts`
- 添加对应的函数类型声明

---

## 第八步：展示变更摘要并请求确认

```
========== jpush-react-native 更新摘要 ==========
Android JPush SDK:  旧版本 → 新版本
iOS JPush SDK:      旧版本 → 新版本
插件版本:            旧版本 → 新版本

新增 API：
  + methodName(params)  // 说明（双端统一）
  + methodName()        // iOS only

移除 API：
  - methodName()

行为变更：
  ! 变更说明

修改的文件：
  - android/build.gradle
  - JPushRN.podspec
  - android/src/.../JPushModule.java
  - ios/RCTJPushModule/RCTJPushModule.m
  - index.js
  - index.d.ts
  - package.json
  - CHANGELOG.md
==================================================

确认以上变更并发布到 npm? [y/N]
```

---

## 第九步：发布（确认后执行）

用户输入 `y` 后：

```bash
python3 .claude/skills/update-sdk/scripts/publisher.py
```
