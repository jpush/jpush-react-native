import { 
  DeviceEventEmitter, 
  NativeModules,
  Platform
 } from 'react-native'

const JPushModule = NativeModules.JPushModule

const listeners = {}
const receiveCustomMsgEvent = 'receivePushMsg'
const receiveNotificationEvent = 'receiveNotification'
const openNotificationEvent = 'openNotification'
const connectionChangeEvent = 'connectionChange'

const getRegistrationIdEvent = 'getRegistrationId' // Android Only
const openNotificationLaunchAppEvent = 'openNotificationLaunchApp' // iOS Only
const networkDidLogin = 'networkDidLogin' // iOS Only
const receiveExtrasEvent = 'receiveExtras' // Android Only

export default class JPush {
  /**
   * 初始化JPush 必须先初始化才能执行其他操作
   */
  static initPush () {
    if (Platform.OS == "android") {
      JPushModule.initPush()
    } else {
      JPush.setupPush()
    }
  }
  /**
   * 停止推送，调用该方法后将不再受到推送
   */
  static stopPush () {
    JPushModule.stopPush()
  }

  /**
   * 恢复推送功能，停止推送后，可调用该方法重新获得推送能力
   */
  static resumePush () {
    if (Platform.OS == "android") {
      JPushModule.resumePush()
    } else {
      JPush.setupPush()
    }
  }

  /**
   * Android Only
   */
  static crashLogOFF () {
    JPushModule.crashLogOFF()
  }

  /**
   * Android Only
   */
  static crashLogON () {
    JPushModule.crashLogON()
  }

  /**
   * Android Only
   *
   * @param {Function} cb
   */
  static notifyJSDidLoad (cb) {
    JPushModule.notifyJSDidLoad(resultCode => {
      cb(resultCode)
    })
  }

  /**
   * 清除通知栏的所有通知
   */
  static clearAllNotifications () {
    if (Platform.OS == "android") {
      JPushModule.clearAllNotifications()
    } else {
      JPush.setBadge(0,() => {})
    }
  }

  /**
   * Android Only
   */
  static clearNotificationById (id) {
    JPushModule.clearNotificationById(id)
  }

  /**
   * Android Only
   */
  static getInfo (cb) {
    JPushModule.getInfo(map => {
      cb(map)
    })
  }

  /**
   * 获取当前连接状态
   * @param {Fucntion} cb = (Boolean) => {}
   * 如果连接状态变更为已连接返回 true
   * 如果连接状态变更为断开连接连接返回 false
   */
  static getConnectionState (cb) {
    JPushModule.getConnectionState(state => {
      cb(state)
    })
  }

  /**
   * 重新设置 Tag
   *
   * @param {Array} tags = [String]
   * @param {Function} cb = (result) => {  }
   * 如果成功 result = {tags: [String]}
   * 如果失败 result = {errorCode: Int}
   */
  static setTags (tags, cb) {
    JPushModule.setTags(tags, result => {
      cb(result)
    })
  }

  /**
   * 在原有 tags 的基础上添加 tags
   *
   * @param {Array} tags = [String]
   * @param {Function} cb = (result) => {  }
   * 如果成功 result = {tags: [String]}
   * 如果失败 result = {errorCode: Int}
   */
  static addTags (tags, cb) {
    JPushModule.addTags(tags, result => {
      cb(result)
    })
  }

  /**
   * 删除指定的 tags
   *
   * @param {Array} tags = [String]
   * @param {Function} cb = (result) => {  }
   * 如果成功 result = {tags: [String]}
   * 如果失败 result = {errorCode: Int}
   *
   */
  static deleteTags (tags, cb) {
    JPushModule.deleteTags(tags, result => {
      cb(result)
    })
  }

  /**
   * 清空所有 tags
   *
   * @param {Function} cb = (result) => { }
   * 如果成功 result = {tags: [String]}
   * 如果失败 result = {errorCode: Int}
   *
   */
  static cleanTags (cb) {
    JPushModule.cleanTags(result => {
      cb(result)
    })
  }

  /**
   * 获取所有已有标签
   *
   * @param {Function} cb = (result) => { }
   * 如果成功 result = {tags: [String]}
   * 如果失败 result = {errorCode: Int}
   *
   */
  static getAllTags (cb) {
    JPushModule.getAllTags(result => {
      cb(result)
    })
  }

  /**
   * 检查当前设备是否绑定该 tag
   *
   * @param {String} tag
   * @param {Function} cb = (result) => { }
   * 如果成功 result = {isBind: true}
   * 如果失败 result = {errorCode: Int}
   *
   */
  static checkTagBindState (tag, cb) {
    JPushModule.checkTagBindState(tag, result => {
      cb(result)
    })
  }

  /**
   * 重置 alias
   * @param {String} alias
   * @param {Function} cb = (result) => { }
   * 如果成功 result = {alias: String}
   * 如果失败 result = {errorCode: Int}
   *
   */
  static setAlias (alias, cb) {
    JPushModule.setAlias(alias, result => {
      cb(result)
    })
  }

  /**
   * 删除原有 alias
   *
   * @param {Function} cb = (result) => { }
   * 如果成功 result = {alias: String}
   * 如果失败 result = {errorCode: Int}
   *
   */
  static deleteAlias (cb) {
    JPushModule.deleteAlias(result => {
      cb(result)
    })
  }

  /**
   * 获取当前设备 alias
   *
   * @param {Function} cb = (result) => { }
   * 如果成功 result = {alias: String}
   * 如果失败 result = {errorCode: Int}
   *
   */
  static getAlias (cb) {
    JPushModule.getAlias(map => {
      cb(map)
    })
  }

  /**
   * Android Only
   */
  static setStyleBasic () {
    JPushModule.setStyleBasic()
  }

  /**
   * Android Only
   */
  static setStyleCustom () {
    JPushModule.setStyleCustom()
  }

  /**
   * Android Only
   */
  static setLatestNotificationNumber (maxNumber) {
    JPushModule.setLatestNotificationNumber(maxNumber)
  }

  /**
   * Android Only
   * @param {object} config = {"startTime": String, "endTime": String}  // 例如：{startTime: "20:30", endTime: "8:30"}
   */
  static setSilenceTime (config) {
    JPushModule.setSilenceTime(config)
  }

  /**
   * Android Only
   * @param {object} config = {"days": Array, "startHour": Number, "endHour": Number}
   * // 例如：{days: [0, 6], startHour: 8, endHour: 23} 表示星期天和星期六的上午 8 点到晚上 11 点都可以推送
   */
  static setPushTime (config) {
    JPushModule.setPushTime(config)
  }

  /**
   * Android Only
   */
  static jumpToPushActivity (activityName) {
    JPushModule.jumpToPushActivity(activityName)
  }

  /**
   * Android Only
   */
  static jumpToPushActivityWithParams (activityName, map) {
    JPushModule.jumpToPushActivityWithParams(activityName, map)
  }

  /**
   * Android Only
   */
  static finishActivity () {
    JPushModule.finishActivity()
  }

  /**
   * 监听：自定义消息后事件
   * @param {Function} cb = (Object) => { }
   */
  static addReceiveCustomMsgListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(
      receiveCustomMsgEvent,
      message => {
        cb(message)
      }
    )
  }

  /**
   * 取消监听：自定义消息后事件
   * @param {Function} cb = (Object) => { }
   */
  static removeReceiveCustomMsgListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * iOS Only
   * 点击推送启动应用的时候原生会将该 notification 缓存起来，该方法用于获取缓存 notification
   * 注意：notification 可能是 remoteNotification 和 localNotification，两种推送字段不一样。
   * 如果不是通过点击推送启动应用，比如点击应用 icon 直接启动应用，notification 会返回 undefine。
   * @param {Function} cb = (notification) => {}
   */
  static getLaunchAppNotification (cb) {
    JPushModule.getLaunchAppNotification(cb)
  }

  /**
   * @deprecated Since version 2.2.0, will deleted in 3.0.0.
   * iOS Only
   * 监听：应用没有启动的状态点击推送打开应用
   * 注意：2.2.0 版本开始，提供了 getLaunchAppNotification
   * 
   * @param {Function} cb = (notification) => {}
   */
  static addOpenNotificationLaunchAppListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(
      openNotificationLaunchAppEvent,
      registrationId => {
        cb(registrationId)
      }
    )
  }

  /**
   * @deprecated Since version 2.2.0, will deleted in 3.0.0.
   * iOS Only
   * 取消监听：应用没有启动的状态点击推送打开应用
   * @param {Function} cb = () => {}
   */
  static removeOpenNotificationLaunchAppEventListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * iOS Only
   *
   * 监听：应用连接已登录
   * @param {Function} cb = () => {}
   */
  static addnetworkDidLoginListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(
      networkDidLogin,
      registrationId => {
        cb(registrationId)
      }
    )
  }

  /**
   * iOS Only
   *
   * 取消监听：应用连接已登录
   * @param {Function} cb = () => {}
   */
  static removenetworkDidLoginListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * 监听：接收推送事件
   * @param {} cb = (Object）=> {}
   */
  static addReceiveNotificationListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(
      receiveNotificationEvent,
      map => {
        cb(map)
      }
    )
  }

  /**
   * 取消监听：接收推送事件
   * @param {Function} cb = (Object）=> {}
   */
  static removeReceiveNotificationListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * 监听：点击推送事件
   * @param {Function} cb  = (Object）=> {}
   */
  static addReceiveOpenNotificationListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(
      openNotificationEvent,
      message => {
        cb(message)
      }
    )
  }

  /**
   * 取消监听：点击推送事件
   * @param {Function} cb  = (Object）=> {}
   */
  static removeReceiveOpenNotificationListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * Android Only
   *
   * If device register succeed, the server will return registrationId
   */
  static addGetRegistrationIdListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(
      getRegistrationIdEvent,
      registrationId => {
        cb(registrationId)
      }
    )
  }

  /**
   * Android Only
   */
  static removeGetRegistrationIdListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * 监听：连接状态变更
   * @param {Function} cb = (Boolean) => { }
   * 如果连接状态变更为已连接返回 true
   * 如果连接状态变更为断开连接连接返回 false
   */
  static addConnectionChangeListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(
      connectionChangeEvent,
      state => {
        cb(state)
      }
    )
  }

  /**
   * 监听：连接状态变更
   * @param {Function} cb = (Boolean) => { }
   * 如果连接状态变更为已连接返回 true
   * 如果连接状态变更为断开连接连接返回 false
   */
  static removeConnectionChangeListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * 监听：收到 Native 下发的 extra 事件
   * @param {Function} cb = (map) => { }
   * 返回 Object，属性和值在 Native 定义
   */
  static addReceiveExtrasListener (cb) {
    listeners[cb] = DeviceEventEmitter.addListener(receiveExtrasEvent, map => {
      cb(map)
    })
  }

  static removeReceiveExtrasListener (cb) {
    if (!listeners[cb]) {
      return
    }
    listeners[cb].remove()
    listeners[cb] = null
  }

  /**
   * 获取 RegistrationId
   * @param {Function} cb = (String) => { }
   */
  static getRegistrationID (cb) {
    JPushModule.getRegistrationID(id => {
      cb(id)
    })
  }

  /**
   * iOS Only
   * 初始化 JPush SDK 代码,
   * NOTE: 如果已经在原生 SDK 中添加初始化代码则无需再调用 （通过脚本配置，会自动在原生中添加初始化，无需额外调用）
   */
  static setupPush () {
    JPushModule.setupPush()
  }

  /**
   * iOS Only
   * @param {Function} cb = (String) => { } // 返回 appKey
   */
  static getAppkeyWithcallback (cb) {
    JPushModule.getAppkeyWithcallback(appkey => {
      cb(appkey)
    })
  }

  /**
   * iOS Only
   * @param {Function} cb = (int) => { } // 返回应用 icon badge。
   */
  static getBadge (cb) {
    JPushModule.getApplicationIconBadge(badge => {
      cb(badge)
    })
  }

  /**
   * iOS Only
   * 设置本地推送
   * @param {Number} date  触发本地推送的时间的时间戳(毫秒)
   * @param {String} textContain 推送消息体内容
   * @param {Int} badge  本地推送触发后 应用 Badge（小红点）显示的数字
   * @param {String} alertAction 弹框的按钮显示的内容（IOS 8默认为"打开", 其他默认为"启动"）
   * @param {String} notificationKey  本地推送标示符
   * @param {Object} userInfo 推送的附加字段 选填
   * @param {String} soundName 自定义通知声音，设置为 null 为默认声音
   */
  static setLocalNotification (
    date,
    textContain,
    badge,
    alertAction,
    notificationKey,
    userInfo,
    soundName
  ) {
    JPushModule.setLocalNotification(
      date,
      textContain,
      badge,
      alertAction,
      notificationKey,
      userInfo,
      soundName
    )
  }

  /**
   * @typedef Notification
   * @type {object}
   * // Android Only
   * @property {number} [buildId] - 通知样式：1 为基础样式，2 为自定义样式（需先调用 `setStyleCustom` 设置自定义样式）
   * @property {number} [id] - 通知 id, 可用于取消通知
   * @property {string} [title] - 通知标题
   * @property {string} [content] - 通知内容
   * @property {object} [extra] - extra 字段
   * @property {number} [fireTime] - 通知触发时间（毫秒）
   * // iOS Only
   * @property {number} [badge] - 本地推送触发后应用角标值
   * // iOS Only
   * @property {string} [soundName] - 指定推送的音频文件
   * // iOS 10+ Only
   * @property {string} [subtitle] - 子标题
   */

  /**
   * @param {Notification} notification
   */
  static sendLocalNotification (notification) {
    JPushModule.sendLocalNotification(notification)
  }

  /**
   * iOS Only
   * 设置应用 Badge（小红点）
   * @param {Int} badge
   * @param {Function} cb = () => { } //
   */
  static setBadge (badge, cb) {
    JPushModule.setBadge(badge, value => {
      cb(value)
    })
  }
}
