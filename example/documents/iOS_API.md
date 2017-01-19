## jpush-react-native iOS API

All apis can find in jpush-react-native/index.js.

- setBadge(badge, cb)

设置 badge 值
```
JPushModule.setBadge(5, (badgeNumber) => {
  console.log(badgeNumber)
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

