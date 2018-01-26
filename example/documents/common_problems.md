## 常见问题

* [事件的解析](#事件的解析)
* [页面跳转](#页面跳转)
* [编译报错](#编译报错)
* [iOS 收不到推送](#iOS收不到推送)
* [iOS 应用角标 Badge](#iOS应用角标Badge)
* [其他](#其他)

### 事件的解析

插件提供几种事件，这里对常见误区进行解释：

#### iOS：

iOS 插件在 2.0.0+ 版本才提供 add**\*\*\*\***Listener 的方法，如果使用该接口，建议升级到最新版本。

* 收到推送并且点击推送：

  * 应用没有启动情况：走 `JPushModule.addOpenNotificationLaunchAppListener` 的回调

  * 应用已经启动但是应用在前台：

    * iOS 10 及以上的系统：走 `JPushModule.addReceiveOpenNotificationListener` 的回调

    * iOS 9 以下的系统：走 `JPushModule.addReceiveNotificationListener` 的回调

* 在前台收到推送：走 `JPushModule.addReceiveNotificationListener` 的回调
  * iOS 10 允许推送在前台展示，如果应用在前台且点击了推送，那么还会走 `JPushModule.addReceiveOpenNotificationListener` 回调。

#### Android

* 没有执行 addReceiveOpenNotificationListener 回调。

解决方法： 在监听通知事件前，Android 加入了 `notifiyJSDidLoad` （1.6.6 版本后加入），务必在监听事件前先调用此方法。

### 页面跳转

#### iOS：

应用可以在点击推送事件中直接在 reactJS 中做跳转。

#### Android:

可以在点击推送事件中直接在 JS 中做跳转。也可以跳转到原生界面。第二种情况可以[参考这篇文章的高级应用部分](http://www.jianshu.com/p/6721a0360af9)

### 编译报错

#### iOS：

* 编译报 JCore 相关错误：检查 `jcore-react-native` 安装了没，一般成功安装并且成功 link 后就能解决该问题。

* 编译报 i386 错误：这种错误一般是使用 iphone5s 以下模拟器报的错误，如果使用模拟器建议使用 iphone 5s 以上的模拟器，整机编译不受印象。

* 编译报 arm64 或者 x86_64 错误：一般是使用模拟器编译 release 导致的，通过真机编译就不会有这个问题，如果实在是想在模拟器上编译 release 可以参考该 [issue](https://github.com/jpush/jpush-react-native/issues/104)

* 编译找不到头文件：在 iOS 工程中如果找不到头文件可能要在 TARGETS-> BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下路径

  ```
  $(SRCROOT)/../node_modules/jpush-react-native/ios/RCTJPushModule
  ```

#### Android

* 编译时报错：找不到符号。

解决方法：import 相关类。可手动导入，也可使用 Android Studio 打开项目，然后使用 option + enter 导入相关类。

* 编译时报错：Multiple dex files define

解决方法：可手动删除 jpush , jcore 下的 build 文件夹，然后重新编译。也可以使用 AS 打开项目，然后选择菜单：Build -> Rebuild Project

### iOS 收不到推送

* 确保是在真机上测试，而不是在模拟器
* 自己的应用已经在 Apple developer 给应用配置推送功能，创建推送证书 （并且保证 bundle id 与 Apple developer 上的是一致的）如果之前没有接触过推送证书建议看视频来 👉 [官方集成视频](https://community.jiguang.cn/t/jpush-ios-sdk/4247)
* 能够获取 deviceToken 但是收不到推送， 如果是使用 xcode 8，检查 (Project -> Target -> Capabilities ) Push Notification 选项是否已经点开，如果没有需要点开

### iOS 应用角标 Badge

有两种方式变变应用角标

* 通过服务器下发，服务端 payload 有一个字段 badge 用于设置应用角标，如果客户端收到该条推送应用角标会被设为 badge ，如果想实现应用收到推送 badge 自动 +1 可以让服务端推送时将 badge 设为 "+1"。

* 调用 setBadge 接口也可以改变应用角标，该 api 会设置本地应用的 badge 并且同步极光服务器的 badge 值（收到推送自动加一会依赖于极光服务器的 badge 值）。

推送事件回调参数中，有一个 badge 值，该值就是服务器下发的 badge 值。

### 其他

#### RegistrationID 相关

建议参考这篇博文 [RegistrationID](https://community.jiguang.cn/t/registrationid/3810)

#### 取消弹出 Toast 信息。

解决方法：在加入 JPushPackage 时，将第一个参数设置为 true 即可。第二个参数设置为 true 将不会打印 debug 日志。
