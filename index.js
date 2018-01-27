import { DeviceEventEmitter, NativeModules, Platform } from 'react-native'
const { JPushModule } = NativeModules

const listeners = {}
const receiveCustomMsgEvent = 'receivePushMsg'
const receiveNotificationEvent = 'receiveNotification'
const openNotificationEvent = 'openNotification'
const connectionChangeEvent = 'connectionChange'

const getRegistrationIdEvent = 'getRegistrationId' // Android Only
const openNotificationLaunchAppEvent = 'openNotificationLaunchApp' // iOS Only
const networkDidLogin = 'networkDidLogin' // iOS Only
const receiveExtrasEvent = 'receiveExtras' // Android Only

const JPush = {}

/**
 * Bind to native method
 *
 * @param {?Function} fn
 * @param {boolean} noCallback
 * @return {Function.<any, Promise>}
 */
const bind = (fn, noCallback) => function () {
  const args = arguments
  const next = typeof args[args.length - 1] === 'function'
    ? Array.prototype.pop.call(args)
    : x => x

  if (typeof fn !== 'function' && fn != null) {
    throw new Error('fn must be a function or null')
  }

  return new Promise(resolve => {
    if (typeof fn === 'function') {
      if (!noCallback) {
        Array.prototype.push.call(args, resolve)
      }

      fn.apply(fn, args)
      if (noCallback) {
        resolve()
      }
    } else {
      resolve()
    }
  }).then(next)
}

bind.noCallback = (fn) => bind(fn, true)
bind.androidOnly = (fn, noCb) => bind(Platform.select({ android: fn }), noCb)
bind.iosOnly = (fn, noCb) => bind(Platform.select({ ios: fn }), noCb)

// @type {() => Promise.<void>}
JPush.initPush =
  JPush.setupPush =
  bind.noCallback(Platform.select({
    android: JPushModule.initPush,
    ios: JPushModule.setupPush
  }))

// @type {() => Promise.<void>}
JPush.stopPush =
  bind.noCallback(JPushModule.stopPush)

// @type {() => Promise.<void>}
JPush.resumePush =
  bind.androidOnly(JPushModule.resumePush, true)

// @type {() => Promise.<void>}
JPush.enableCrashLog =
  JPush.crashLogON =
  bind.androidOnly(JPushModule.crashLogON, true)

// @type {() => Promise.<void>}
JPush.disableCrashLog =
  JPush.crashLogOFF =
  bind.androidOnly(JPushModule.crashLogOFF, true)

// @type {() => Promise.<void>}
JPush.notifyJSDidLoad =
  bind.androidOnly(JPushModule.notifyJSDidLoad, true)

// @type {() => Promise.<void>}
JPush.clearAllNotifications =
  bind.androidOnly(JPushModule.clearAllNotifications, true)

// @type {(string) => Promise.<void>}
JPush.clearNotificationById =
  bind.androidOnly(JPushModule.clearNotificationById, true)

// @type {() => Promise.<Object>}
JPush.getInfo =
  bind.androidOnly(JPushModule.getInfo)

// @type {() => Promise.<boolean>}
JPush.getConnectionState =
  bind(JPushModule.getConnectionState)

/**
 * 重设 Tag
 *
 * @type {Function<string[], Promise.<{ tags: string[], errorCode: number }>>}
 */
JPush.setTags =
  bind(JPushModule.setTags)

/**
 * 添加 Tag
 *
 * @type {Function<string[], Promise.<{ tags: string[], errorCode: number }>>}
 */
JPush.addTags =
  bind(JPushModule.addTags)

/**
 * 删除 Tag
 *
 * @type {Function<string[], Promise.<{ tags: string[], errorCode: number }>>}
 */
JPush.deleteTags =
  bind(JPushModule.deleteTags)

/**
 * 清空 Tag
 *
 * @type {Function<string[], Promise.<{ tags: string[], errorCode: number }>>}
 */
JPush.cleanTags =
  bind(JPushModule.cleanTags)

/**
 * 获取所有关联 Tag
 *
 * @type {Function<string[], Promise.<{ tags: string[], errorCode: number }>>}
 */
JPush.getAllTags =
  bind(JPushModule.getAllTags)

/**
 * 检查当前设备是否绑定该 Tag
 *
 * @type {Function<string, Promise.<{ isBind: boolean, errorCode: number }>>}
 */
JPush.checkTagBindState =
  bind(JPushModule.checkTagBindState)

/**
 * 重置 alias
 *
 * @type {Function<string, Promise.<{ alias: string, errorCode: number }>>}
 */
JPush.setAlias =
  bind(JPushModule.setAlias)

/**
 * 删除 alias
 *
 * @type {Function<string, Promise.<{ alias: string, errorCode: number }>>}
 */
JPush.deleteAlias =
  bind(JPushModule.deleteAlias)

/**
 * 获取 alias
 *
 * @type {Function<string, Promise.<{ alias: string, errorCode: number }>>}
 */
JPush.getAlias =
  bind(JPushModule.getAlias)

// TODO: no input?
// @type {() => Promise.<void>}
JPush.setStyleBasic =
  bind.androidOnly(JPushModule.setStyleBasic, true)

// TODO: no input?
// @type {() => Promise.<void>}
JPush.setStyleCustom =
  bind.androidOnly(JPushModule.setStyleCustom, true)

// @type {(number) => Promise.<void>}
JPush.setLatestNotificationNumber =
  bind.androidOnly(JPushModule.setLatestNotificationNumber, true)

/**
 * @typedef SilenceConfig
 * @type {Object}
 * @property {string} startTime - for example "20:30"
 * @property {string} endTime - for example "8:30"
 */

// @type {Function.<SilenceConfig, void>
JPush.setSilenceTime =
  bind.androidOnly(JPushModule.setSilenceTime, true)

/**
 * @typedef PushConfig
 * @type {Object}
 * @property {number[]} days - for example [0, 6]
 * @property {number} startHour - for example 8
 * @property {number} endHour - for example 23
 */

// @type {Function.<PushConfig, void>
JPush.setPushTime =
  bind.androidOnly(JPushModule.setPushTime, true)

// TODO: Add document
// @type {Function.<string, void>
JPush.jumpToPushActivity =
  bind.androidOnly(JPushModule.jumpToPushActivity, true)

// TODO: Add document
// @type {Function.<string, object, void>
JPush.jumpToPushActivityWithParams =
  bind.androidOnly(JPushModule.jumpToPushActivityWithParams, true)

// TODO: Add document
// @type {Function.<string, void>
JPush.finishActivity =
  bind.androidOnly(JPushModule.finishActivity, true)

// Listeners

/**
 * Create listener adder
 *
 * @param {string} event
 * @return {Function<Callback, JPush>}
 */
const addEventListener = (event) => function (listener) {
  const handler = DeviceEventEmitter.addListener(event, listener)
  handler.listener = listener
  listeners.push(handler)

  return JPush
}

// @type {Function<Callback, JPush>}
JPush.addReceiveCustomMsgListener =
  addEventListener(receiveCustomMsgEvent)

// @type {Function<Callback, JPush>}
JPush.addOpenNotificationLaunchAppListener =
  addEventListener(openNotificationLaunchAppEvent, 'ios')

// @type {Function<Callback, JPush>}
JPush.addNetworkDidLoginListener =
  JPush.addnetworkDidLoginListener =
  addEventListener(networkDidLogin, 'ios')

// @type {Function<Callback, JPush>}
JPush.addReceiveNotificationListener =
  addEventListener(receiveNotificationEvent)

// @type {Function<Callback, JPush>}
JPush.addReceiveOpenNotificationListener =
  addEventListener(openNotificationEvent)

// @type {Function<Callback, JPush>}
JPush.addGetRegistrationIdListener =
  addEventListener(getRegistrationIdEvent, 'android')

// @type {Function<Callback, JPush>}
JPush.addConnectionChangeListener =
  addEventListener(connectionChangeEvent)

// @type {Function<Callback, JPush>}
JPush.addReceiveExtrasListener =
  addEventListener(receiveExtrasEvent, 'android')

// @type {Function<Callback, JPush>}
JPush.removeListener =
  JPush.removeReceiveCustomMsgListener =
  JPush.removeOpenNotificationLaunchAppEventListener =
  JPush.removenetworkDidLoginListener =
  JPush.removeReceiveNotificationListener =
  JPush.removeReceiveOpenNotificationListener =
  JPush.removeGetRegistrationIdListener =
  JPush.removeConnectionChangeListener =
  JPush.removeReceiveExtrasListener =
  function (listener) {
    for (let i = listeners.length - 1; i >= 0; --i) {
      const handler = listeners[i]
      if (handler.listener === listener) {
        listeners.splice(i, 1)
        handler.listener = null
        handler.remove()
      }
    }
  }

// @type {Function<void, JPush>}
JPush.removeAllListener =
  function () {
    for (let i = listeners.length - 1; i >= 0; --i) {
      const handler = listeners[i]
      listeners.splice(i, 1)
      handler.listener = null
      handler.remove()
    }
  }

// @type {() => Promise.<string>}
JPush.getRegistrationID =
  bind(JPushModule.getRegistrationID)

// @type {() => Promise.<string>}
JPush.getAppKey =
  JPush.getAppkeyWithcallback =
  bind.iosOnly(JPushModule.getAppkeyWithcallback)

// @type {() => Promise.<number>}
JPush.getBadge =
  bind.iosOnly(JPushModule.getApplicationIconBadge)

// @type {(number) => Promise.<void>}
JPush.setBadge =
  bind.iosOnly(JPushModule.setBadge)

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

// TODO: No callback?
// @type {Function.<Notification, Promise.<void>>
JPush.sendLocalNotification =
  bind(JPushModule.sendLocalNotification, true)

/**
 * TODO: No callback?
 *
 * Set local notification
 *
 * @param {Number} date - 触发本地推送的时间的时间戳(毫秒)
 * @param {String} textContain - 推送消息体内容
 * @param {Int} badge - 本地推送触发后 应用 Badge（小红点）显示的数字
 * @param {String} alertAction - 弹框的按钮显示的内容（IOS 8默认为"打开", 其他默认为"启动"）
 * @param {String} notificationKey - 本地推送标示符
 * @param {Object} userInfo - 推送的附加字段 选填
 * @param {String} soundName - 自定义通知声音，设置为 null 为默认声音
 * @return {Promise.<void>}
 */
JPush.setLocalNotification =
  bind.iosOnly(JPushModule.setLocalNotification, true)

export default JPush
