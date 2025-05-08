import {
    DeviceEventEmitter,
    NativeModules,
    Platform
} from 'react-native'

const JPushModule = NativeModules.JPushModule

const listeners = {}
const ConnectEvent           = 'ConnectEvent'            //连接状态
const NotificationEvent      = 'NotificationEvent'       //通知事件
const LocalNotificationEvent = 'LocalNotificationEvent'  //本地通知事件
const CustomMessageEvent     = 'CustomMessageEvent'      //自定义消息事件
const InappMessageEvent      = 'InappMessageEvent'       //应用内消息事件
const TagAliasEvent          = 'TagAliasEvent'           //TagAlias/Pros事件
const MobileNumberEvent      = 'MobileNumberEvent'       //电话号码事件
const CommandEvent      = 'CommandEvent'       //COMMAND事件

export default class JPush {

    /*
    * 设置调试模式，默认关闭状态
    *
    * 该接口需在 init 接口之前调用，避免出现部分日志没打印的情况
    * @param enable = boolean
    * */
    static setLoggerEnable(enable) {
        JPushModule.setDebugMode(enable)
    }

    /*
    * 初始化推送服务
    * {"appKey":"","channel":"dev","production":1}
    * 请在componentDidMount()调用init，否则会影响通知点击事件的回调
    * */
    static init(params) {
        if (Platform.OS == "android") {
            JPushModule.init()
        } else {
            JPushModule.setupWithConfig(params)
        }
    }

    /*
    * 获取 RegistrationID
    *
    * 调用此 API 来取得应用程序对应的 RegistrationID。
    * 只有当应用程序成功注册到 JPush 的服务器时才返回对应的值，否则返回空字符串
    *
    * @param {Function} callback = (result) => {"registerID":String}
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
   /*
    * 设置推送个性化属性/更新用户指定推送个性化属性
    * */
    static setProperties(params) {
        if (Platform.OS == "android") {
            JPushModule.setProperties(params)
        } else {
            JPushModule.setProperties(params)
        }
    }
    /*
    * 删除指定推送个性化属性
    * */
    static deleteProperties(params) {
        if (Platform.OS == "android") {
            JPushModule.deleteProperties(params)
        } else {
            JPushModule.deleteProperties(params)
        }
    }
    /*
    * 清除所有推送个性化属性
    * */
    static cleanProperties() {
        if (Platform.OS == "android") {
            JPushModule.cleanProperties()
        } else {
            JPushModule.cleanProperties()
        }
    }


  
    /* 应用内消息，请配置pageEnterTo 和 pageLeave 方法，请配套使用
    * 进入页面，pageName:页面名 String
    * */
    static pageEnterTo(pageName) {
        if (Platform.OS == "android") {
            
        } else {
            JPushModule.pageEnterTo(pageName)
        }
    }

    /* 应用内消息，请配置pageEnterTo 和 pageLeave 方法，请配套使用
    * 离开页面，pageName:页面名 String 
    * */
    static pageLeave(pageName) {
        if (Platform.OS == "android") {
            
        } else {
            JPushModule.pageLeave(pageName)
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

    /*
    *  JPush SDK 开启和关闭省电模式，默认为关闭。
    * */
    static setPowerSaveMode(enable){
        if (Platform.OS == "android"){
            JPushModule.setPowerSaveMode(enable)
        }
    }

    /*
    *   检查当前应用的通知开关是否开启
    * */
    static isNotificationEnabled(callback){
        if (Platform.OS == "android"){
            JPushModule.isNotificationEnabled(callback)
        } else {
            JPushModule.isNotificationEnabled(callback)
        }
    }

    //***************************************本地通知***************************************

    /*
    * 添加一个本地通知
    *
    * @param {"messageID":String,"title":String，"content":String,"extras":{String:String},"broadcastTime":String}
    *
    * messageID:唯一标识通知消息的ID，可用于移除消息。
    * android用到的是int，ios用到的是String，rn这边提供接口的时候统一改成了String，然后android拿到String转int。输入messageID的时候需要int值范围在[1，2147483647]然后转成String。
    *
    * title:对应“通知标题”字段
    *
    * content:对应“通知内容”字段
    * broadcastTime：定时通知展示时间，需要把 时间戳(毫秒) 转为String 传入。
    *
    * extras:对应“附加内容”字段
    *
    * */
    static addLocalNotification(params) {
        if (Platform.OS == "android") {
            JPushModule.addLocalNotification(params)
        } else {
            JPushModule.addNotification(params)
        }
    }

    /*
    * 移除指定的本地通知
    *
    * @param {"messageID":String}
    *
    * messageID:唯一标识通知消息的ID，可用于移除消息
    *
    * */
    static removeLocalNotification(params) {
        if (Platform.OS == "android") {
            JPushModule.removeLocalNotification(params)
        } else {
            JPushModule.removeNotification(params)
        }
    }

    /*
    * 移除所有的本地通知
    * */
    static clearLocalNotifications() {
        if (Platform.OS == "android") {
            JPushModule.clearLocalNotifications()
        } else {
            JPushModule.clearLocalNotifications()
        }
    }

    /*
    *  清除所有 JPush 展现的通知（不包括非 JPush SDK 展现的）
    * */
    static clearAllNotifications(){
        if (Platform.OS == "android") {
            JPushModule.clearAllNotifications();
        }
    }

    /*
    *  删除指定的通知
    * */
    static clearNotificationById(params){
        if (Platform.OS == "android") {
            JPushModule.clearNotificationById(params);
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
            JPushModule.setGeofeneceMaxCount(params)
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
    //CommandEvent 事件回调
    static addCommandEventListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
                CommandEvent, result => {
                callback(result)
            })
    }

    /*
    * 通知事件
    *
    * @param {Function} callback = (result) => {"messageID":String,"title":String，"content":String,"badge":String,"ring":String,"extras":{String:String},"notificationEventType":String}
    *
    * messageID:唯一标识通知消息的 ID
    *
    * title:对应 Portal 推送通知界面上的“通知标题”字段
    *
    * content:对应 Portal 推送通知界面上的“通知内容”字段
    *
    * badge:对应 Portal 推送通知界面上的可选设置里面的“badge”字段 (ios only)
    *
    * ring:对应 Portal 推送通知界面上的可选设置里面的“sound”字段 (ios only)
    *
    * extras:对应 Portal 推送消息界面上的“可选设置”里的附加字段
    *
    * notificationEventType：分为notificationArrived和notificationOpened两种
    *
    * 注意：应用在存活状态下点击通知不会有跳转行为，应用在被杀死状态下点击通知会启动应用
    *
    * */
    static addNotificationListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            NotificationEvent, result => {
                callback(result)
            })
    }

    /*
    * 本地通知事件
    *
    * @param {Function} callback = (result) => {"messageID":String,"title":String，"content":String,"extras":{String:String},"notificationEventType":String}
    *
    * messageID:唯一标识通知消息的ID，可用于移除消息
    *
    * title:对应“通知标题”字段
    *
    * content:对应“通知内容”字段
    *
    * extras:对应“附加内容”字段
    *
    * notificationEventType：分为notificationArrived和notificationOpened两种
    *
    * 注意：应用在存活状态下点击通知不会有跳转行为，应用在被杀死状态下点击通知会启动应用
    *
    * */
    static addLocalNotificationListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            LocalNotificationEvent, result => {
                callback(result)
            })
    }

    /*
    * 自定义消息事件
    *
    * @param {Function} callback = (result) => {"messageID":String，"content":String,"extras":{String:String}}}
    *
    * messageID:唯一标识自定义消息的 ID
    *
    * content:对应 Portal 推送消息界面上的“自定义消息内容”字段
    *
    * extras:对应 Portal 推送消息界面上的“可选设置”里的附加字段
    *
    * */
    static addCustomMessageListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            CustomMessageEvent, result => {
                callback(result)
            })
    }

    /*
    * 应用内消息事件
    *
    * @param {Function} callback = (result) => {"mesageId":String，"title":String, "content":String, "target":String, "clickAction":String, extras":{String:String}}}
    *
    * messageID:唯一标识自定义消息的 ID
    *
    * title: 标题
    *
    * content:内容
    *
    * target:目标页面
    *
    * clickAction:跳转地址
    *
    * extras:附加字段
    *
    * */
    static addInappMessageListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            InappMessageEvent, result => {
                callback(result)
            })
    }

    /*
    * tag alias事件
    *
    * @param {Function} callback = (result) => {"code":int,"sequence":int，"tags":String,"tag":String,"tagEnable":boolean,"alias":String}
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
    * @param {Function} callback = (result) => {"code":int,"sequence":int}
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

    //***************************************Android Only***************************************

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
    * @param params = {"notificationMaxNumber":int}
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
    * 动态配置 channel，优先级比 AndroidManifest 里配置的高
    * */
    static setChannel(params) {
        if (Platform.OS == "android") {
            JPushModule.setChannel(params)
        } else {
            // setupWithOpion
        }
    }
    static setChannelAndSound(params) {
            if (Platform.OS == "android") {
                JPushModule.setChannelAndSound(params)
            } else {
                // setupWithOpion
            }
        }


    //***************************************iOS Only***************************************

    /*
    * 设置 Badge
    *
    * @param params = {"badge":int,"appBadge":int}
    *
    * badge:JPush封装badge功能，允许应用上传 badge 值至 JPush 服务器，由 JPush 后台帮助管理每个用户所对应的推送 badge 值，简化了设置推送 badge 的操作。设置的值小于0时，sdk不作处理。
    *
    * appBadge:iOS 用来标记应用程序状态的一个数字，出现在程序图标右上角。设置的值小于0时，sdk不作处理。
    *
    * */
    static setBadge(params) {
        if (Platform.OS == "ios") {
            JPushModule.setBadge(params)
        }else if (Platform.OS == "android") {
            JPushModule.setBadgeNumber(params)
        }
    }

    static setLinkMergeEnable(enable) {
        if (Platform.OS == "ios") {
        }else if (Platform.OS == "android") {
            JPushModule.setLinkMergeEnable(enable)
        }
    }
    static setSmartPushEnable(enable) {
        if (Platform.OS == "ios") {
            JPushModule.setSmartPushEnable(enable)
        }else if (Platform.OS == "android") {
            JPushModule.setSmartPushEnable(enable)
        }
    }
    static setDataInsightsEnable(enable) {
        if (Platform.OS == "ios") {
            
        }else if (Platform.OS == "android") {
            JPushModule.setDataInsightsEnable(enable)
        }
    }
    static setGeofenceEnable(enable) {
         if (Platform.OS == "ios") {
         }else if (Platform.OS == "android") {
             JPushModule.setGeofenceEnable(enable)
         }
    }

    static setCollectControl(params) {
         if (Platform.OS == "ios") {
            JPushModule.setCollectControl(params)
         }else if (Platform.OS == "android") {
             JPushModule.setCollectControl(params)
         }
    }

}
