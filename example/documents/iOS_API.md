## jpush-react-native iOS API

All apis can find in jpush-react-native/index.js.

* setBadge(Int, Function)

  设置 badge 值

  ```
    JPushModule.setBadge(5, (success) => {
      console.log(success)
    });
  ```

- getBadge

  获取 badge 值

  ```javascript
  JPushModule.getBadge(badge => {
    console.log(badge)
  })
  ```

  ​

- setLocalNotification

  ```javascript
  setLocalNotification(
    Date, // date  触发本地推送的时间
    textContain, // String 推送消息体内容
    badge, // int   本地推送触发后 应用 Badge（小红点）显示的数字
    alertAction, // String 弹框的按钮显示的内容（IOS 8默认为"打开", 其他默认为"启动"）
    notificationKey, // String 本地推送标示符
    userInfo, // Object 推送的附加字段 (任意键值对)
    soundName // String 自定义通知声音，设置为 null 为默认声音
  )

  设置本地推送
  ```

  ```javascript
  JPushModule.setLocalNotification(
    this.state.date,
    this.state.textContain,
    5,
    'Action',
    'notificationIdentify',
    { myInfo: '' },
    null
  )
  ```

## 事件

**NOTE: **iOS 在 jpush-react-native@2.0.0 以上版本才提供该方法

**点击推送启动应用事件**

* addOpenNotificationLaunchAppListener(Function)

  监听：应用没有启动的状态点击推送打开应用

  ```javascript
  JPushModule.addOpenNotificationLaunchAppListener(notification => {})
  ```

* removeOpenNotificationLaunchAppListener(Function)

  取消监听：应用没有启动的状态点击推送打开应用，和 `addOpenNotificationLaunchAppListener` 成对使用

**登录事件**

**NOTE: **iOS 在 jpush-react-native@2.0.0 以上版本才提供该方法

* addnetworkDidLoginListener(Function)

  监听：极光 SDK 已登录，setTag 和 setAlias 相关操作需要在这个事件触发后才能起作用

  ```javascript
  JPushModule.addnetworkDidLoginListener(() => {})
  ```

* removenetworkDidLoginListener(Function)

  取消监听：应用连接已登录，和 `addnetworkDidLoginListener` 成对使用
