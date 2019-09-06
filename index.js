import {
  DeviceEventEmitter,
  NativeModules,
  Platform
} from 'react-native'

const JPushModule = NativeModules.JPushModule

const listeners = {}
const ConnectEvent            = 'ConnectEvent'            //连接状态
const NotificationEvent       = 'NotificationEvent'       //通知事件
const CustomMessageEvent      = 'CustomMessageEvent'      //自定义消息事件
const LocalNotificationEvent  = 'LocalNotificationEvent'  //本地通知事件 todo
const TagAliasEvent           = 'TagAliasEvent'           //TagAlias事件
const MobileNumberEvent       = 'MobileNumberEvent'       //电话号码事件

export default class JPush {

  /*
  * 设置调试模式，默认关闭状态
  *
  * 该接口需在 init 接口之前调用，避免出现部分日志没打印的情况
  * @param params = {"debug":boolean}
  * */
  static setLoggerEnable(params) {
    JPushModule.setDebugMode(params)
  }

  /*
  * 初始化推送服务
  * */
  static init() {
    if (Platform.OS == "android") {
      JPushModule.init()
    }
  }

  /*
  * 获取 RegistrationID
  *
  * 调用此 API 来取得应用程序对应的 RegistrationID。
  * 只有当应用程序成功注册到 JPush 的服务器时才返回对应的值，否则返回空字符串
  *
  * @param {Fucntion} callback = (result) => {"registerID":String}
  * */
  static getRegistrationID(callback) {
    if (Platform.OS == "android") {
      JPushModule.getRegistrationID(callback)
    } else {
      JPushModule.getRegisterId(callback)
    }
  }

  /*
  * 新增标签
  *
  * 这个接口是增加逻辑，而不是覆盖逻辑
  *
  * @param params = {"sequence":int,"tags":StringArray}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * tag:
  * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
  * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
  *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
  * */
  static addTags(params) {
    if (Platform.OS == "android") {
      JPushModule.addTags(params)
    } else {
      JPushModule.addTags(params)
    }
  }

  /*
  * 覆盖标签
  *
  * 需要理解的是，这个接口是覆盖逻辑，而不是增量逻辑。即新的调用会覆盖之前的设置
  *
  * @param params = {"sequence":int,"tags":StringArray}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * tag:
  * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
  * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
  *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
  * */
  static updateTags(params) {
    if (Platform.OS == "android") {
      JPushModule.setTags(params)
    } else {
      JPushModule.setTags(params)
    }
  }

  /*
  * 删除指定标签
  *
  * @param params = {"sequence":int,"tag":StringArray}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * tag:
  * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
  * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
  *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
  * */
  static deleteTag(params) {
    if (Platform.OS == "android") {
      JPushModule.deleteTags(params)
    } else {
      JPushModule.deleteTags(params)
    }
  }

  /*
  * 清除所有标签
  *
  * @param params = {"sequence":int}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * */
  static deleteTags(params) {
    if (Platform.OS == "android") {
      JPushModule.cleanTags(params)
    } else {
      JPushModule.cleanTags(params)
    }
  }

  /*
  * 查询指定 tag 与当前用户绑定的状态
  *
  * @param params = {"sequence":int,"tag":String}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * tag:
  * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
  * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
  *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
  * */
  static queryTag(params) {
    if (Platform.OS == "android") {
      JPushModule.checkTagBindState(params)
    } else {
      JPushModule.validTag(params)
    }
  }

  /*
  * 查询所有标签
  *
  * @param params = {"sequence":int}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * */
  static queryTags(params) {
    if (Platform.OS == "android") {
      JPushModule.getAllTags(params)
    } else {
      JPushModule.getAllTags(params)
    }
  }

  /*
  * 设置别名
  * 需要理解的是，这个接口是覆盖逻辑，而不是增量逻辑。即新的调用会覆盖之前的设置
  *
  * @param params = {"sequence":int,"alias":String}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * alias:
  * 每次调用设置有效的别名，覆盖之前的设置
  * 有效的别名组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
  * 限制：alias 命名长度限制为 40 字节。（判断长度需采用 UTF-8 编码）
  * */
  static setAlias(params) {
    if (Platform.OS == "android") {
      JPushModule.setAlias(params)
    } else {
      JPushModule.setAlias(params)
    }
  }

  /*
  * 删除别名
  *
  * @param params = {"sequence":int}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * */
  static deleteAlias(params) {
    if (Platform.OS == "android") {
      JPushModule.deleteAlias(params)
    } else {
      JPushModule.deleteAlias(params)
    }
  }

  /*
  * 查询别名
  *
  * @param params = {"sequence":int}
  *
  * sequence:
  * 请求时传入的序列号，会在回调时原样返回
  * */
  static queryAlias(params) {
    if (Platform.OS == "android") {
      JPushModule.getAlias(params)
    } else {
      JPushModule.getAlias(params)
    }
  }

  //***************************************统计***************************************

  /*
  * 设置手机号码。该接口会控制调用频率，频率为 10s 之内最多 3 次
  *
  * @param params = {"sequence":int,"mobileNumber":String}
  *
  * sequence:请求时传入的序列号，会在回调时原样返回
  * */
  static setMobileNumber(params) {
    if (Platform.OS == "android") {
      JPushModule.setMobileNumber(params)
    } else {
      JPushModule.setMobileNumber(params)
    }
  }

  /*
  * 开启 CrashLog 上报
  * */
  static initCrashHandler() {
    if (Platform.OS == "android") {
      JPushModule.initCrashHandler()
    } else {
      JPushModule.crashLogON(null)
    }
  }

  //***************************************本地通知 todo***************************************

  /*
  * 添加一个本地通知
  * */
  static addLocalNotification(params) {
    if (Platform.OS == "android") {
      JPushModule.addLocalNotification(params)
    } else {
      JPushModule.addNotification(null)
    }
  }

  /*
  * 移除指定的本地通知
  * */
  static removeLocalNotification(params) {
    if (Platform.OS == "android") {
      JPushModule.removeLocalNotification(params)
    } else {

    }
  }

  /*
  * 移除所有的本地通知
  * 注意notificationId为0或者负数时通知无法移除
  * */
  static clearLocalNotifications() {
    if (Platform.OS == "android") {
      JPushModule.clearLocalNotifications()
    } else {

    }
  }

  //***************************************地理围栏***************************************

  /*
  * 设置最多允许保存的地理围栏数量，超过最大限制后，如果继续创建先删除最早创建的地理围栏。
  * 默认数量为10个，允许设置最小1个，最大100个。
  * */
  static setMaxGeofenceNumber(params) {
    if (Platform.OS == "android") {
      JPushModule.setMaxGeofenceNumber(params)
    } else {
      JPushModule.setGeofenecMaxCount(params)
    }
  }

  /*
  * 删除指定id的地理围栏
  * */
  static deleteGeofence(params) {
    if (Platform.OS == "android") {
      JPushModule.deleteGeofence(params)
    } else {
      JPushModule.removeGeofenceWithIdentifier(params)
    }
  }

  //***************************************接口回调***************************************

  //连接状态
  static addConnectEventListener(callback) {
    listeners[callback] = DeviceEventEmitter.addListener(
      ConnectEvent, result => {
        callback(result)
      })
  }

  /*
  * 通知事件
  *
  * @param {Fucntion} callback = (result) => {"messageID":int,"title":int，"content":StringArray,"extras":{String:String}},"notificationType":String}
  *
  * messageID:
  *
  * title:
  *
  * content:
  *
  * extras:
  *
  * notificationType：分为notificationArrived和notificationOpened两种
  *
  * */
  static addNotificationListener(callback) {
    listeners[callback] = DeviceEventEmitter.addListener(
      NotificationEvent, result => {
        callback(result)
      })
  }

  /*
  * 自定义消息事件
  *
  * @param {Fucntion} callback = (result) => {"messageID":int，"content":StringArray,"extras":{String:String}}}
  *
  * messageID:
  *
  * content:
  *
  * extras:
  *
  * */
  static addCustomMessagegListener(callback) {
    listeners[callback] = DeviceEventEmitter.addListener(
      CustomMessageEvent, result => {
        callback(result)
      })
  }

  //本地通知事件 todo
  static addLocalNotificationListener(callback) {
    listeners[callback] = DeviceEventEmitter.addListener(
      LocalNotificationEvent, result => {
        callback(result)
      })
  }

  /*
  * tag alias事件
  *
  * @param {Fucntion} callback = (result) => {"code":int,"sequence":int，"tags":StringArray,"tag":String,"tagEnable":boolean,"alias":String}
  *
  * code:结果，0为操作成功
  *
  * sequence:请求时传入的序列号，会在回调时原样返回
  *
  * tags:执行tag数组操作时返回
  *
  * tag:执行查询指定tag(queryTag)操作时会返回,tagEnable:执行查询指定tag(queryTag)操作时会返回是否可用
  *
  * alias：对alias进行操作时返回
  *
  * */
  static addTagAliasListener(callback) {
    listeners[callback] = DeviceEventEmitter.addListener(
      TagAliasEvent, result => {
        callback(result)
      })
  }

  /*
  * 手机号码事件
  *
  * @param {Fucntion} callback = (result) => {"code":int,"sequence":int}
  *
  * code:结果，0为操作成功
  *
  * sequence:请求时传入的序列号，会在回调时原样返回
  *
  * */
  static addMobileNumberListener(callback) {
    listeners[callback] = DeviceEventEmitter.addListener(
      MobileNumberEvent, message => {
        callback(message)
      })
  }

  //移除事件
  static removeListener(callback) {
    if (!listeners[callback]) {
      return
    }
    listeners[callback].remove()
    listeners[callback] = null
  }

  //***************************************Android Only todo***************************************

  /*
 * 在 Android 6.0 及以上的系统上，需要去请求一些用到的权限.
 * JPush SDK 用到的一些需要请求如下权限，因为需要这些权限使统计更加精准，功能更加丰富，建议开发者调用
 * "android.permission.READ_PHONE_STATE"
 * "android.permission.ACCESS_FINE_LOCATION"
 * "android.permission.READ_EXTERNAL_STORAGE"
 * "android.permission.WRITE_EXTERNAL_STORAGE"
 * */
  static requestPermission() {
    if (Platform.OS == "android") {
      JPushModule.requestPermission()
    }
  }

  /*
 * 停止推送服务
 * */
  static stopPush() {
    if (Platform.OS == "android") {
      JPushModule.stopPush()
    }
  }

  /*
  * 恢复推送服务
  * */
  static resumePush() {
    if (Platform.OS == "android") {
      JPushModule.resumePush()
    }
  }

  /*
  * 用来检查 Push Service 是否已经被停止
  * */
  static isPushStopped(callback) {
    if (Platform.OS == "android") {
      JPushModule.isPushStopped(callback)
    }
  }

  /*
  * 设置允许推送时间
  *
  * 默认情况下用户在任何时间都允许推送。即任何时候有推送下来，客户端都会收到，并展示。
  * 开发者可以调用此 API 来设置允许推送的时间。
  * 如果不在该时间段内收到消息，SDK 的处理是：推送到的通知会被扔掉。
  *
  * 这是一个纯粹客户端的实现，所以与客户端时间是否准确、时区等这些，都没有关系。
  * 而且该接口仅对通知有效，自定义消息不受影响。
  * */
  static setPushTime(params) {
    if (Platform.OS == "android") {
      JPushModule.setPushTime(params)
    }
  }

  /*
  * 设置通知静默时间
  *
  * 默认情况下用户在收到推送通知时，客户端可能会有震动，响铃等提示。
  * 但用户在睡觉、开会等时间点希望为“免打扰”模式，也是静音时段的概念。
  * 开发者可以调用此 API 来设置静音时段。如果在该时间段内收到消息，则：不会有铃声和震动。
  * */
  static setSilenceTime(params) {
    if (Platform.OS == "android") {
      JPushModule.setSilenceTime(params)
    }
  }

  /*
 * 设置保留最近通知条数
 *
 * 通过极光推送，推送了很多通知到客户端时，如果用户不去处理，就会有很多保留在那里。
 * 调用此 API 可以限制保留的通知条数，默认为保留最近 5 条通知。
 *
 * 仅对通知有效。所谓保留最近的，意思是，如果有新的通知到达，之前列表里最老的那条会被移除。
 * 例如，设置为保留最近 5 条通知。假设已经有 5 条显示在通知栏，当第 6 条到达时，第 1 条将会被移除。
 * */
  static setLatestNotificationNumber(params) {
    if (Platform.OS == "android") {
      JPushModule.setLatestNotificationNumber(params)
    }
  }

  /*
  * 设置默认通知栏样式构建类
  *
  * 如果不调用此方法定制，则极光 Push SDK 默认的通知栏样式是：Android 标准的通知栏提示。
  * */
  static setDefaultPushNotificationBuilder(params) {
    if (Platform.OS == "android") {
      JPushModule.setDefaultPushNotificationBuilder(params)
    }
  }

  /*
  * 设置某编号的通知栏样式构建类
  * 当开发者需要为不同的通知，指定不同的通知栏样式（行为）时，则需要调用此方法设置多个通知栏构建类。
  *
  * */
  static setPushNotificationBuilder(params) {
    if (Platform.OS == "android") {
      JPushModule.setPushNotificationBuilder(params)
    }
  }

  /*
 * 动态配置 channel，优先级比 AndroidManifest 里配置的高
 * */
  static setChannel(params) {
    if (Platform.OS == "android") {
      JPushModule.setChannel(params)
    } else {
      // setupWithOpion
    }
  }

  /*
  * 清除通知
  *
  * 此 API 提供清除通知的功能，包括：清除所有 JPush 展现的通知（不包括非 JPush SDK 展现的）
  * */
  static clearAllNotifications() {
    if (Platform.OS == "android") {
      JPushModule.clearAllNotifications()
    } else {
      // 本地通知移除功能，传nil时移除所有
    }
  }

  /*
  * 清除指定某个通知
  * */
  static clearNotificationById(params) {
    if (Platform.OS == "android") {
      JPushModule.clearNotificationById(params)
    } else {
      // 本地通知移除功能，传nil时移除所有
    }
  }

  /*
  * 用于上报用户的通知栏被打开，或者用于上报用户自定义消息被展示等客户端需要统计的事件
  * */
  static reportNotificationOpened(params) {
    if (Platform.OS == "android") {
      JPushModule.reportNotificationOpened(params)
    } else {
      // handleRemoteNotification
    }
  }

  //***************************************iOS Only todo***************************************

  /*
  * 设置 Badge
  *
  * @param params = {"badge":int}
  *
  * badge 是 iOS 用来标记应用程序状态的一个数字，出现在程序图标右上角。
  * JPush 封装 badge 功能，允许应用上传 badge 值至 JPush 服务器，由 JPush 后台帮助管理每个用户所对应的推送 badge 值，简化了设置推送 badge 的操作。
  * */
  static setBadge(params) {
    if (Platform.OS == "ios") {
      JPushModule.setBadge(params)
    }
  }

}
