## jpush-react-native iOS API

All apis can find in jpush-react-native/index.js.

- setBadge(badge, cb)

设置 badge 值
```
JPushModule.setBadge(5, (success) => {
  console.log(success)
});
```

- setLocalNotification( date,
                        textContain,     // date
                        badge,           // int
                        alertAction,     // String
                        notificationKey, // String
                        userInfo,   // Dictionary
                        soundName   // String
                        )

设置本地推送
```
  JPushModule.setLocalNotification( this.state.date, 
                                    this.state.textContain,
                                    5, 
                                    'dfsa',
                                    'dfaas',
                                    null,
                                    null);
```

## 事件
监听 `ReceiveNotification` 事件，收到到推送的时候会回调
```
var subscription = NativeAppEventEmitter.addListener(
  'ReceiveNotification',
  (notification) => console.log(notification)
);
```

监听 `OpenNotification` 事件，点击推送的时候会执行这个回调
```
var subscription = NativeAppEventEmitter.addListener(
  'OpenNotification',
  (notification) => console.log(notification)
);
```

监听 `networkDidReceiveMessage` 事件，收到 JPush 应用内消息会执行这个回调
```
var subscription = NativeAppEventEmitter.addListener(
  'networkDidReceiveMessage',
  (message) => console.log(message)
);
```
