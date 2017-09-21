## 常见问题

### Android
1. 编译时报错：找不到符号。


解决方法：import 相关类。可手动导入，也可使用 Android Studio 打开项目，然后使用 option + enter 导入相关类。

2. 编译时报错：Multiple dex files define 

解决方法：可手动删除 jpush , jcore 下的 build 文件夹，然后重新编译。也可以使用 AS 打开项目，然后选择菜单：Build -> Rebuild Project



3. 没有执行 addReceiveOpenNotificationListener 回调。

解决方法： 在监听通知事件前，Android 加入了 `notifiyJSDidLoad` （1.6.6 版本后加入），务必在监听事件前先调用此方法。



4. 取消弹出 Toast 信息。

解决方法：在加入 JPushPackage 时，将第一个参数设置为 true 即可。第二个参数设置为 true 将不会打印 debug 日志。



