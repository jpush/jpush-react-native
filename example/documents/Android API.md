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

Add this listener to receive custom message.

- addReceiveCustomMsgListener(callback)


- removeReceiveCustomMsgListener(event)

- addReceiveNotificationListener(callback)

**特别说明，如果想要在点击通知的时候，跳转到指定的界面，并将该界面以外的 Activity 关掉等等之类的操作，可能需要修改一下要跳转的 Activity 的启动类型或者修改跳转标志。具体修改 JPushModule.java 中 onReceive 方法中收到通知的代码（有注释），这里我推荐的做法是在 Native 创建 Activity，然后用 JS 渲染界面，具体可以[参考这篇文章](http://www.jianshu.com/p/7c03db422c6d)**

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
