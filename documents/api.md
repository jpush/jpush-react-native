[English document](api_en.md)

* [Common API](#common-api)
  * [initPush](#initpush)
  * [getRegistrationID](#getregistrationid)
  * [stopPush](#stoppush)
  * [resumePush](#resumepush)
  * [setAlias](#setalias)
  * [addTags](#addtags)
  * [deleteTags](#deletetags)
  * [setTags](#settags)
  * [cleanTags](#cleantags)
  * [sendLocalNotification](#sendlocalnotification)
  * [clearLocalNotifications](#clearlocalnotifications)
  * [removeLocalNotification](#removelocalnotification)
  * [clearAllNotifications](#clearallnotifications)
  * [clearNotificationById](#clearnotificationbyId)
  * [点击推送事件](#点击推送事件)
  * [接收推送事件](#接收推送事件)
  * [接收自定义消息事件](#接收自定义消息事件)
  * [hasPermission](#haspermission)
* [iOS Only API](#ios-only-api)
  * [setupPush](#setuppush)
  * [setBadge](#setbadge)
  * [getBadge](#getbadge)
  * [setLocalNotification](#setlocalnotification)
  * [getLaunchAppNotification](#getlaunchappnotification)
  * [点击推送启动应用事件](#open-notification-launch-app-event)
  * [网络成功登陆事件](#network-did-login-event)
* [Android Only API](#android-only-api)
  * [crashLogOFF](#crashlogoff)
  * [crashLogON](#crashlogno)
  * [notifyJSDidLoad](#notifyjsdidload)
  * [getInfo](#getInfo)
  * [setStyleBasic](#setstylebasic)
  * [setStyleCustom](#setstylecustom)
  * [setLatestNotificationNumber](#setlatestnotificationnumber)
  * [setSilenceTime](#setsilencetime)
  * [setPushTime](#setpushtime)
  * [setGeofenceInterval](#setgeofenceinterval)
  * [setMaxGeofenceNumber](#setmaxgeofencenumber)
  * [addGetRegistrationIdListener](#addgetregistrationIdlistener)
  * [removeGetRegistrationIdListener](#removegetregistrationidlistener)

注意: 需要调用先调用 `initPush` 方法才能正常使用。

### Common API

Android 和 iOS 通用 API。

#### initPush

初始化 JPush，这个方法初始化推送功能 iOS 会弹出获取推送权限的提示框（注意这个系统提示框只会触发一次，如果用户首次不同意，之后需要用户到设置中修改推送权限）。

```
JPushModule.initPush()
```

Android 建议在原生 `MainActivity` 的 `onCreate` 中调用：

```
// java 原生代码
JPushInterface.init(this);
```
#### getRegistrationID

* getRegistrationID(function)

  获取 registrationId，这个 JPush 运行通过 registrationId 来进行推送

  ```javascript
  JPushModule.getRegistrationID(registrationId => {})
  ```

#### stopPush

停止推送。

```
JPushModule.stopPush();
```

#### resumePush

恢复推送。建议在 `MainActivity` 的 `onResume` 中调用：

```
// android native java
JPushInterface.onResume(this);
```

```
// iOS - javascirpt
JPushModule.resumePush();
```
#### setAlias

* setAlias(alias, successCallback)

  * alias：String

    * 空字符串 （@""）表示取消之前的设置。
    * 每次调用设置有效的别名，覆盖之前的设置。
    * 有效的别名组成：字母（区分大小写）、数字、下划线、汉字。
    * 限制：alias 命名长度限制为 40 字节。（判断长度需采用 UTF-8 编码）

  ```javascript
  JPushModule.setAlias('alias', success => {})
  ```

#### addTags

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.7+ 。

在原有 tags 的基础上添加 tags。

* addTags(tags, callback)

  * tags: [String] tag 集合
    * 每次调用至少设置一个 tag
    * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字。
    * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，但总长度不得超过 5K 字节。（判断长度需采用 UTF-8 编码）
    * 单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制

  ```javascript
  JPushModule.addTags(['tag1', 'tag2'], success => {})
  ```

#### deleteTags

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.7+ 。

删除指定的 tags

* deleteTags(tags, callback)

  * tags: [String] tag 集合
    * 每次调用至少设置一个 tag。
    * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字。
    * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，但总长度不得超过 5K 字节。（判断长度需采用 UTF-8 编码）。
    * 单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制。

  ```javascript
  JPushModule.deleteTags(['tag1', 'tag2'], success => {})
  ```

#### cleanTags

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.7+ 。

清除所有 tags

* cleanTags(callback)

  ```javascript
  JPushModule.cleanTags(success => {})
  ```

#### setTags

* setTags(tags, callback)

  * tags: [String] tag 集合
    * 每次调用至少设置一个 tag
    * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字。
    * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，但总长度不得超过 5K 字节。（判断长度需采用 UTF-8 编码）
    * 单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制

  ```javascript
  JPushModule.setTags(['tag1', 'tag2'], success => {})
  ```

#### sendLocalNotification

* sendLocalNotification(notification)

  * **buildId** : Number // 设置通知样式，1 为基础样式，2 为自定义样式。自定义样式需要先调用 setStyleCustom 接口设置自定义样式。(Android Only)
  * **id** : Number // 通知的 id, 可用于取消通知
  * **title** : String // 通知标题
  * **content** : String // 通知内容
  * **extra** : Object // extra 字段
  * **fireTime** : Number // 通知触发时间的时间戳（毫秒）
  * **badge** : Number // 本地推送触发后应用角标的 badge 值 （iOS Only）
  * **sound** : String // 指定推送的音频文件 （iOS Only）
  * **subtitle** : String // 子标题 （iOS10+ Only）

  ```javascript
  var currentDate = new Date()
  JPushModule.sendLocalNotification({
    id: 5,
    content: 'content',
    extra: { key1: 'value1', key2: 'value2' },
    fireTime: currentDate.getTime() + 3000,
    badge: 8,
    sound: 'fasdfa',
    subtitle: 'subtitle',
    title: 'title'
  })
  ```

#### clearLocalNotifications

移除所有的本地通知

```
JPushModule.clearLocalNotifications();
```

#### removeLocalNotification

根据 notificationId 移除指定的本地通知, notificationId 为 int 类型。

```
var notificationId = 5;
JPushModule.removeLocalNotification(notificationId);
```

#### clearAllNotifications

清除所有通知

```
JPushModule.clearAllNotifications();
```

#### clearNotificationById

根据 notificationId 来清除通知, notificationId 为 int 类型。

```
var notificationId = 5;
JPushModule.clearNotificationById(notificationId);
```

#### 点击推送事件

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.0+ 。参数 function 不能复用，不能用于其他 add****Listener 的方法。

* addReceiveOpenNotificationListener(function)

  ```javascript
  var callback = map => {}
  JPushModule.addReceiveOpenNotificationListener(callback)
  ```

* removeReceiveOpenNotificationListener(function)

  ```javascript
  JPushModule.removeReceiveOpenNotificationListener(callback)
  ```

#### 接收推送事件

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.0+ 。参数 function 不能复用，不能用于其他 add****Listener 的方法。

* addReceiveNotificationListener(function)

  ```javascript
  var callback = event => {
    console.log('alertContent: ' + JSON.stringify(event))
  }
  JPushModule.addReceiveNotificationListener(callback)
  ```

* removeReceiveNotificationListener(function)

  ```
  JPushModule.removeReceiveNotificationListener(callback);
  ```

#### 接收自定义消息事件

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.0+ 。参数 function 不能复用，不能用于其他 add****Listener 的方法。

* addReceiveCustomMsgListener(function)

  ```javascript
  var callback = message => {
    console.log('alertContent: ' + JSON.stringify(message))
  }
  JPushModule.addReceiveCustomMsgListener(callback)
  ```

- removeReceiveCustomMsgListener(function)

  ```
  JPushModule.removeReceiveCustomMsgListener(callback);
  ```


#### hasPermission

获取应用是否有推送权限。

```
JPushModule.hasPermission( res => {
  // res = boolen
})
```

### iOS Only API

#### setupPush

调用这个接口会向系统注册推送功能（会弹出推送权限请求），注意使用自动配置会自动在 `AppDeletate.m` 插入注册代码如下，如果不希望在应用启动的时候就向用户申请权限可以删掉这部分代码。

```objective-c
// AppDelegate.m 自动插入的代码
JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
[JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
```

#### setBadge

设置应用 badge 值，该方法还会同步 JPush 服务器的的 badge 值，JPush 服务器的 badge 值用于推送 badge 自动 +1 时会用到。

```js
JPushModule.setBadge(5, success => {})
```

#### getBadge

获取应用 badge 值。

```javascript
JPushModule.getBadge(badge => {})
```

#### setLocalNotification

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

#### getLaunchAppNotification

点击推送启动应用的时候原生会将该 notification 缓存起来，该方法用于获取缓存的 notification。

```javascript
JPushModule.getLaunchAppNotification( notification => {
  if (notification === undefined) {
    // 说明应用不是通过点击通知启动的，是通过点击应用 icon
  } else if (notification['aps'] === undefined) {
    // 说明是 local notification
  } else {
    // 说明是 remote notification
  }
})
```

#### 点击推送启动应用事件

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.0+ 。

* addOpenNotificationLaunchAppListener(function)

  添加监听：`addOpenNotificationLaunchAppListener` 添加事件回调，应用没有启动的情况下，点击推送会执行该回调.

  ```javascript
  var callback = notification => {
    console.log(JSON.stringify(nofitifation))
  }
  JPushModule.addOpenNotificationLaunchAppListener(callback)
  ```

* removeOpenNotificationLaunchAppEventListener(function)

  ```javascript
  JPushModule.removeOpenNotificationLaunchAppEventListener(callback)
  ```

  取消监听：`removeOpenNotificationLaunchAppEventListener` 取消事件回调，和`addOpenNotificationLaunchAppListener` 方法成对使用。

**Network Did Login Event**

**NOTE**: iOS 需要安装到 jpush-react-native@2.0.0+ 。

* addnetworkDidLoginListener(function)

  添加回调：添加网络已登录事件回调 ，`setTag` 和 `setAlias` 需要在网络已经登录成功后调用才会有效 。

  ```javascript
  var callback = () => {}
  JPushModule.addnetworkDidLoginListener(callback)
  ```

* removenetworkDidLoginListener(function)

  移除回调：移除该回调 ，`removenetworkDidLoginListener` 取消事件回调，和 `addnetworkDidLoginListener` 方法成对使用。

### Android Only API


* #### crashLogOFF

  停止上报崩溃日志

  ```
  JPushModule.crashLogOFF();
  ```

* #### crashLogON

  开启上报崩溃日志

  ```
  JPushModule.crashLogON();
  ```

* #### notifyJSDidLoad

  通知 JPushModule 初始化完成，发送缓存事件。

  ```
  JPushModule.notifyJSDidLoad((resultCode) => {

  });
  ```

* #### getInfo

  获取设备信息

  ```
  JPushModule.getInfo((map) => {
  });
  ```

* #### setStyleBasic

  设置通知为基本样式

  ```
  JPushModule.setStyleBasic();
  ```

* #### setStyleCustom

  自定义通知样式，需要添加自定义 xml 样式。

  ```
  JPushModule.setStyleCustom();
  ```

* #### setLatestNotificationNumber

  设置展示最近通知的条数，默认展示 5 条。

  ```
  JPushModule.setLatestNotificationNumber(maxNumber);
  ```

* #### setSilenceTime

  设置静默推送时间

  ```
  /**
   * Android Only
   * @param {object} config = {"startTime": String, "endTime": String}  // 例如：{startTime: "20:30", endTime: "8:30"}
   */
  JPushModule.setSilenceTime(config);
  ```

* #### setPushTime

  设置允许推送时间

  ```
  /**
   * Android Only
   * @param {object} config = {"days": Array, "startHour": Number, "endHour": Number}  
   * // 例如：{days: [0, 6], startHour: 8, endHour: 23} 表示星期天和星期六的上午 8 点到晚上 11 点都可以推送
   */
  JPushModule.setPushTime(config);
  ```

* #### setGeofenceInterval

  v2.5.0 开始支持,设置地理围栏监控周期，最小3分钟，最大1天。默认为15分钟，当距离地理围栏边界小于1000米周期自动调整为3分钟。设置成功后一直使用设置周期，不会进行调整。
  

  ```
  /**
   * Android Only
   * @param interval number
   监控周期，单位是毫秒。
   */
  JPushModule.setGeofenceInterval(interval);
  ```
  ​
* #### setMaxGeofenceNumber

  v2.5.0 开始支持,设置最多允许保存的地理围栏数量，超过最大限制后，如果继续创建先删除最早创建的地理围栏。默认数量为10个，允许设置最小1个，最大100个。

  ```
  /**
   * Android Only
   * @param maxNumber number
   最多允许保存的地理围栏个数
   */
  JPushModule.setMaxGeofenceNumber(maxNumber);
  ```

* #### addGetRegistrationIdListener (^2.1.4 Deprecated, 使用 [getRegistrationId](#getregistrationid) 代替)

  如果添加这个监听，设备注册成功后，打开应用将会回调这个事件。

  ```
  JPushModule.addGetRegistrationIdListener(cb)
  ```

* #### removeGetRegistrationIdListener (^2.1.4 Deprecated)

  移除监听 registrationId 事件，与 `addGetRegistrationIdListener` 成对使用。

  ```
  JPushModule.removeGetRegistrationIdListener(callback);
  ```

  ​

  ​

  ​
