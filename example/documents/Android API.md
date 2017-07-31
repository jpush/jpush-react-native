## jpush-react-native Android API

All apis can find in jpush-react-native/index.js.

Init push must be called before you trying to call the other methods.

初始化 JPush，建议在 Android 的 MainActivity 中调用，可以参考 eample

- initPush()

Get device and other info.

得到设备信息

- getInfo(map)

```
JPushModule.getInfo((map) => {
      this.setState({
            appkey: map.myAppKey,
            imei: map.myImei,
            package: map.myPackageName,
            deviceId: map.myDeviceId,
            version: map.myVersion
      });
    });
```

If you want to stop receiving notifications, call this method.

停止接收通知

- stopPush()

If you called stop push, call this method to restore.

恢复接收通知

- resumePush()

Default notification style

设置默认的通知样式

- setStyleBasic()

If you want to custom notification style, you should add xml file in layout folder, and modify the setStyleCustom method defined in JPushModule.java

自定义通知样式，需要添加 xml 到 layout 文件夹中，并且修改 setStyleCustom 方法中添加的 xml 的名字

- setStyleCustom()

**Please call this method before you call the listeners method below, otherwise you can't receive these event. v1.6.6 add this new API**

在调用其他接收通知的接口之前，先调用这个接口，v1.6.6 版本添加

- notifyJSDidLoad()

**特别说明，跳转到指定界面现在统一在 JS 处处理**

Clear all notifications

清除所有通知，建议在 `componentWillUnmount` 中调用

- clearAllNotifications()
