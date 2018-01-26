## jpush-react-native Common API

Common API for Android and iOS.

* setTags(array, successCallback,)

* getRegistrationID(callback)

* setAlias(alias, successCallback)

Note: In Android, you must call initPush first, iOS doesn't need.

**收到打开通知事件**

**NOTE: **iOS 在 jpush-react-native@2.0.0 以上版本才提供该方法

* addReceiveOpenNotificationListener(callback)

```
JPushModule.addReceiveOpenNotificationListener((map) => {
      console.log("Opening notification!");
      //自定义点击通知后打开某个 Activity，比如跳转到 pushActivity
      this.props.navigator.jumpTo({name: "pushActivity"});
    });
```

* removeReceiveOpenNotificationListener(event)

**收到通知事件**

**NOTE: **iOS 在 jpush-react-native@2.0.0 以上版本才提供该方法

* addReceiveNotificationListener(callback)

```
JPushModule.addReceiveNotificationListener((map) => {
      console.log("alertContent: " + map.alertContent);
      console.log("extras: " + map.extras);
      // var extra = JSON.parse(map.extras);
      // console.log(extra.key + ": " + extra.value);
});
```

* removeReceiveNotificationListener(event)

**接收自定义消息**(Add this listener to receive custom message.)

**NOTE: **iOS 在 jpush-react-native@2.0.0 以上版本才提供该方法

* addReceiveCustomMsgListener(callback)

- removeReceiveCustomMsgListener(event)
