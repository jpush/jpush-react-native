## jpush-react-native Android API

All apis can find in jpush-react-native/index.js.

Init push must be called before you trying to call the other methods.

- initPush()

Get device and other info.

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

- stopPush()

If you called stop push, call this method to restore.

- resumePush()

Default notification style

- setStyleBasic()

If you want to custom notification style, you should add xml file in layout folder, and modify the setStyleCustom method defined in JPushModule.java

- setStyleCustom()

**Please call this method before you call the listeners method below, otherwise you can't receive these event. v1.6.6 add this new API**
- notifyJSDidLoad()

Add this listener to receive custom message.

- addReceiveCustomMsgListener(callback)


- removeReceiveCustomMsgListener(event)

- addReceiveNotificationListener(callback)

**特别说明，跳转到指定界面现在统一在 JS 处处理**

- addReceiveNotificationListener(callback)

```
JPushModule.addReceiveNotificationListener((map) => {
      console.log("alertContent: " + map.alertContent);
      console.log("extras: " + map.extras);
      // var extra = JSON.parse(map.extras);
      // console.log(extra.key + ": " + extra.value);
});
```

- removeReceiveNotificationListener(event)

- addOpenNotificationListener(callback)
```
JPushModule.addReceiveOpenNotificationListener((map) => {
      console.log("Opening notification!");
      //自定义点击通知后打开某个 Activity，比如跳转到 pushActivity
      this.props.navigator.jumpTo({name: "pushActivity"});
    });
```
- removeOpenNotificationListener(event)
