# JPush React Native Plugin


###Android用法
- 下载并解压这个项目的zip
- 在初始化好的React项目中将app文件夹替换为你刚刚解压的app文件夹（jpush-react-plugin-master/android/app）（如果你还没有初始化，[参考这个](https://facebook.github.io/react-native/docs/getting-started.html#content)）
- 修改android文件夹下的build.gradle将dependencies下的classpath修改为你当前Android Studio所用的版本
- 修改app文件夹下的build.gradle，将compile "com.facebook.react:react-native:0.19.0"修改为你当前的版本
- 在AndroidManifest中更改PackageName和build.gradle中的applicationId为你自己的包名
- 在AndroidManifest中更改appKey
- 运行app

####JS调用sdk的接口说明
- PushHelperModule是Native定义的用来在JS中调用jpush-sdk.jar的接口的NativeModule。以@ReactMethod标签声明的方法可以在JS中通过NativeModule调用：
```
PushHelper.init( (success) => {
      ToastAndroid.show(success, ToastAndroid.SHORT);
    }, (error) => {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
```

这样实际上调用了PushHelperModule中的init()方法：
```
    @ReactMethod
    public void init(Callback successCallback, Callback errorCallback) {
        try {
            JPushInterface.init(PushDemoApplication.getContext());
            successCallback.invoke("init Success!");
            Log.i("PushSDK", "init Success !");
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }

    }
```

其他的方法类似，JPush的Android API说明可以参考[极光文档](http://docs.jpush.io/client/android_api/)。

###iOS用法
-- 下载并解压这个项目的zip
- 在初始化好的React项目中将app文件夹替换为你刚刚解压的app文件夹（jpush-react-plugin-master/android/app）（如果你还没有初始化，[参考这个](https://facebook.github.io/react-native/docs/getting-started.html#content)）
- 将iOS工程目录下的 JPushReactBridge文件夹添加到自己工程中
- 在JPushHelper.h 文件中 替换appkey为你自己key,如下
```
static NSString *appKey = @"替换自己的appkey";
```
- 根据这篇教程[JPush 集成文档](http://docs.jpush.io/client/ios_sdk/#ios-sdk_1) 添加jpush所需的类库和配置信息
- JPushHelper 类中定义了react调用原生JPush方法的接口
- 在AppDelegate 的didRegisterForRemoteNotificationsWithDeviceToken 方法中添加 [JPUSHService registerDeviceToken:deviceToken]; 如下所示
```
- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}
```
- 在js 代码中添加如下代码
```
var PushHelper = require('react-native').NativeModules.JPushHelper;
```
- 这样就可以通过PushHelper 这个变量来访问原生类方法了
- 在js 中通过PushHelper 来注册推送，代码如下
```
PushHelper.setupPush(''); //可以输入任意字符串，该字符串没有意义，该产生的目的是js 无法找到没有参数的方法
```
- 注册推送后就可以成功收到推送了，这里只提供简单的使用说明，如果需要了解更多功能请参考[极光文档](http://docs.jpush.io/client/ios_api/)的接口说明，如果你没有调用原生借口的经验可以参考这篇文章 [调用原生模块](http://reactnative.cn/docs/0.24/native-modules-ios.html#content)
###更新React Native

**进入当前项目的目录**
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

如果更新后执行react-native run-android不能正确运行，而是出现类似：
```
 Could not find com.facebook.react:react-native:0.23.0.
```

错误，或者在Android Studio中直接运行app时报错：
```
Android Studio failed to resolve com.facebook.react:react-native:0.23.0
```

那么可以按照下列命令修复，首先在命令行中执行：
> npm i

执行完毕且不报错后，执行下面的命令，**注意，在执行命令之后，某些文件可能会产生冲突，请确保你的本地文件记录可以恢复**（在Android Studio中可以查看历史记录来恢复文件）
> react-native upgrade

执行上面的命令可能会提示你是否覆盖文件。在解决冲突之后重新运行App即可。

###Android Usage

- Download this project
- Assume that you have already initialized a react project(if not, please refer [this](https://facebook.github.io/react-native/docs/getting-started.html#content)), replace the "app"(which in your android folder that you had initialized just now) with this module.
- Open build.gradle in android folder, replace the classpath with your current edition.
- Open build.gradle in app folder, replace the compile "com.facebook.react:react-native:0.19.0" with your current edition.
- run this application.
