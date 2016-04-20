# JPush React Native Plugin

Android only yet. 

iOS support is coming soon.

###Android用法
- 下载并解压这个项目的zip
- 在初始化好的React项目中将app文件夹替换为你刚刚解压的app文件夹（jpush-react-plugin-master/android/app）（如果你还没有初始化，[参考这个](https://facebook.github.io/react-native/docs/getting-started.html#content)）
- 修改android文件夹下的build.gradle将dependencies下的classpath修改为你当前Android Studio所用的版本
- 修改app文件夹下的build.gradle，将compile "com.facebook.react:react-native:0.19.0"修改为你当前的版本
- 运行app


###更新React Native

- 在命令行中使用：

> react-native --version

就可以查看当前使用的版本

- 在命令行中输入：

> npm info react-native

就可以查看React Native的历史和最新版本

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

###Android Usage

- Download this project
- Assume that you have already initialized a react project(if not, please refer [this](https://facebook.github.io/react-native/docs/getting-started.html#content)), replace the "app"(which in your android folder that you had initialized just now) with this module.
- Open build.gradle in android folder, replace the classpath with your current edition.
- Open build.gradle in app folder, replace the compile "com.facebook.react:react-native:0.19.0" with your current edition.
- run this application.
