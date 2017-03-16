### 关于更新 React Native

**进入当前项目的目录**
- 在命令行中使用：

> react-native --version

就可以查看当前使用的版本

- 在命令行中输入：

> npm info react-native

就可以查看 React Native 的历史和最新版本

- React Native可以直接更新到某个版本：

> npm install --save react-native@0.23.0

就可以更新到0.23.0版本

如果升级后出现类似于
```
react-native@0.23.0 requires a peer of react@^0.14.5 but none was installed.
```

执行:
> npm install --save react

或者：
> npm install --save react@0.14.5

即可。

如果更新后执行 react-native run-android 不能正确运行，而是出现类似：
```
 Could not find com.facebook.react:react-native:0.23.0.
```

错误，或者在 Android Studio 中直接运行 app 时报错：
```
Android Studio failed to resolve com.facebook.react:react-native:0.23.0
```

那么可以按照下列命令修复，首先在命令行中执行：
> npm i

执行完毕且不报错后，执行下面的命令，**注意，在执行命令之后，某些文件可能会产生冲突，请确保你的本地文件记录可以恢复**（在 Android Studio 中可以查看历史记录来恢复文件）
> react-native upgrade

执行上面的命令可能会提示你是否覆盖文件。在解决冲突之后重新运行 App 即可。
