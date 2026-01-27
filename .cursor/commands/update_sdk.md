# 更新SDK

根据输入的需要更新的SDK版本号更新插件。

## 更新步骤

### 1. 更新iOS JPush SDK

使用项目提供的自动下载脚本可以快速下载并替换 iOS SDK：

```bash
# 在项目根目录执行
./.cursor/scripts/download_ios_sdk.sh <版本标签>

# 示例：下载 v5.9.0 版本
./.cursor/scripts/download_ios_sdk.sh v5.9.0
```

脚本会自动：
- 从 GitHub 仓库下载指定版本的 SDK
- 替换 `ios/RCTJPushModule/jpush-ios-x.x.x.xcframework` 目录
- 清理旧版本 SDK
- **自动更新 `ios/RCTJPushModule.xcodeproj/project.pbxproj` 中的 SDK 引用路径**

**注意**：脚本会自动更新 project.pbxproj 文件，并创建备份文件（.bak）。如果自动更新失败，请检查备份文件并手动更新。

### 2. 更新Android JPush SDK

使用项目提供的自动下载脚本可以快速下载并替换 Android SDK：

```bash
# 在项目根目录执行
./.cursor/scripts/download_android_sdk.sh <版本号>

# 示例：下载 5.9.0 版本
./.cursor/scripts/download_android_sdk.sh 5.9.0
```

脚本会自动：
- **尝试自动下载**：脚本会尝试从可能的下载 URL 自动下载 SDK（如果极光提供直接下载链接）
- **如果自动下载失败**：会引导您从[极光官方资源下载页面](https://docs.jiguang.cn/jpush/resources)手动下载
- **自动解压 ZIP 文件**（下载的文件是 ZIP 压缩包）
- **自动从 ZIP 文件的 `libs` 文件夹中提取 jar 文件**
- 自动替换 `android/libs/jpush-android-x.x.x.jar` 文件
- 自动清理旧版本 SDK

**注意**：
- 脚本会先尝试自动下载，如果失败，会引导您手动下载
- 下载的文件是 ZIP 压缩包，SDK jar 文件在压缩包的 `libs` 文件夹下
- 手动下载时，脚本会提示您输入 ZIP 文件路径（支持拖拽文件到终端）
- 脚本会自动解压 ZIP 文件，并从 `libs` 文件夹中提取 jar 文件
- `build.gradle` 会自动加载 `libs` 目录下的所有 jar 文件，无需手动修改

### 3. 查找SDK新增API

**⚠️ 重要：必须仔细逐项检查更新日志，不要因为看到"更新各厂商SDK"等主要更新内容就忽略新增API的检查！**

#### Android SDK
- 访问 [Android SDK Changelog](https://docs.jiguang.cn/jpush/jpush_changelog/updates_Android) 查找新版本的新增对外API
- **检查方法**：
  1. 找到目标版本（如 v5.2.0）的更新内容部分
  2. **逐项阅读**更新内容列表中的每一项，不要跳过任何条目
  3. 特别关注包含以下关键词的条目：
     - "新增"、"新增接口"、"新增API"、"新增方法"
     - "public static"、"public void" 等Java方法签名
     - "支持"、"功能"（可能包含新API）
  4. 对于每个疑似新增API的条目，记录：
     - API方法名（如 `setCollectControl`）
     - 完整方法签名（如 `public static void setCollectControl(JPushCollectControl control)`）
     - 功能描述
- 在 [Android SDK API 文档](https://docs.jiguang.cn/jpush/client/Android/android_api) 中查找并确认新增API的详细用法、参数说明和示例代码

#### iOS SDK
- 访问 [iOS SDK Changelog](https://docs.jiguang.cn/jpush/jpush_changelog/updates_iOS) 查找新版本的新增对外API
- **检查方法**：
  1. 找到目标版本（如 v5.2.0）的更新内容部分
  2. **逐项阅读**更新内容列表中的每一项，不要跳过任何条目
  3. 特别关注包含以下关键词的条目：
     - "新增"、"新增接口"、"新增API"、"新增方法"
     - Objective-C方法签名（如 `- (void)setBadge:completion:`）
     - "支持"、"功能"（可能包含新API）
  4. 对于每个疑似新增API的条目，记录：
     - API方法名
     - 完整方法签名
     - 功能描述
- 在 [iOS SDK API 文档](https://docs.jiguang.cn/jpush/client/iOS/ios_api) 中查找并确认新增API的详细用法、参数说明和示例代码

**检查清单**（在完成检查后确认）：
- [ ] 已找到目标版本的更新日志
- [ ] 已逐项阅读所有更新内容条目（包括次要更新）
- [ ] 已识别所有包含"新增"、"API"、"接口"、"方法"等关键词的条目
- [ ] 已记录所有新增API的方法名和签名
- [ ] 已在API文档中查找并确认了每个新增API的详细用法
- [ ] 已区分哪些是新增的对外API（需要封装），哪些是内部更新（不需要封装）

**常见误区**：
- ❌ 错误：看到"更新各厂商SDK"就认为只是版本更新，没有新增API
- ✅ 正确：即使主要更新是版本升级，也要仔细检查是否有新增API
- ❌ 错误：只关注主要更新内容，忽略列表中的其他条目
- ✅ 正确：必须逐项检查更新内容列表中的每一项
- ❌ 错误：依赖搜索结果判断是否有新增API
- ✅ 正确：直接查看官方更新日志，逐项检查
- ❌ 错误：文本识别有问题时（如缺少字母），直接忽略
- ✅ 正确：如果文本识别有问题，需要手动访问官方文档确认

### 4. 封装新增API（如有）

**⚠️ 重要：如果没有新增API，必须明确说明"经检查，该版本无新增对外API"，而不是简单说"没有新增API"。**

如果SDK有新增API，需要在插件中进行封装：
- 在 `index.js` 中添加JavaScript方法
- 在 `index.d.ts` 中添加TypeScript类型定义
- 在 `android/src/main/java/cn/jiguang/plugins/push/JPushModule.java` 中实现Android端逻辑
- 在 `ios/RCTJPushModule/RCTJPushModule.m` 中实现iOS端逻辑

**封装原则**：
- 如果Android和iOS新增的API是同一个功能，封装成一个插件方法
- 如果不是同一个功能，分开封装
- **不要使用反射的方式调用SDK API，直接调用即可**
- 如果没有新增API，**必须明确说明已检查并确认无新增API**，然后跳过此步骤

**封装步骤**：
1. 确定API的完整签名和参数类型
2. 确定API的调用时机（是否需要在init之前调用）
3. 在对应平台实现方法（Android在JPushModule.java，iOS在RCTJPushModule.m）
4. 在 `index.js` 中添加JavaScript方法，保持与现有API风格一致
5. 在 `index.d.ts` 中添加TypeScript类型定义
6. 添加必要的错误处理和日志

### 5. 更新示例代码

在 `example/App.js` 中添加新增API的示例调用代码（如有新增API）。

### 6. 更新插件版本号

在 `package.json` 中更新插件版本号：

**版本号更新规则**：
- 在现有版本号基础上 + 0.0.1

**示例**：
- 假设当前版本为 `1.2.7`
- 更新后版本为 `1.2.8`

### 7. 更新示例项目依赖版本

在 `example/package.json` 中更新示例项目的插件依赖版本，改为最新的插件版本号：

```json
"dependencies": {
    ...
    "jpush-react-native": "^x.x.x",
    ...
}
```

### 8. 更新CHANGELOG.md

在 `CHANGELOG.md` 中记录本次更新的变更内容，包括：
- SDK版本更新
- **新增的API方法（如有，必须列出具体方法名）**
- 其他相关变更

**如果无新增API，也要明确说明**：
```
## [3.2.2] - YYYY-MM-DD

### Added
- 更新iOS JPush SDK到x.x.x版本
- 更新Android JPush SDK到x.x.x版本
- 经检查，该版本无新增对外API

### Changed
- 插件版本从3.2.1升级到3.2.2
```

## 注意事项

- **必须逐项检查更新日志，不要遗漏任何新增API**
- 确保Android和iOS的SDK版本对应关系正确
- 新增API的封装需要保持与现有API风格一致
- **React Native插件新增方法需要在 `index.js` 和 `index.d.ts` 两个文件中都声明**
- 更新后建议进行测试验证
- **如果更新日志中的文本识别有问题（如缺少字母），需要手动访问官方文档确认**