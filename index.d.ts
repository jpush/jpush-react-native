// Type definition for jpush-react-native 2.6.6

type Callback<T> = (result: T) => void;
type Extra = {
  [key: string]: string;
};

export type Sequence = {
  /**
   * 请求时传入的序列号,会在回调时原样返回
   */
  sequence: number;
};

export type Tag = {
  /**
   * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
   * 限制：每个 tag 命名长度限制为 40 字节,最多支持设置 1000 个 tag,且单次操作总长度不得超过 5000 字节
   *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
   */
  tag: string;
};

type Tags = {
  /**
   * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
   * 限制：每个 tag 命名长度限制为 40 字节,最多支持设置 1000 个 tag,且单次操作总长度不得超过 5000 字节
   *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
   */
  tags: string[];
};

type Alias = {
  /**
   * 有效的别名组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
   * 限制：alias 命名长度限制为 40 字节。（判断长度需采用 UTF-8 编码）
   */
  alias: string;
};

type NotificationId = {
    /**
     * 通知 ID
     * */
    notificationId: String;
};
export default class JPush {
  /**
   * 设置调试模式,默认关闭状态
   *
   * 该接口需在 init 接口之前调用,避免出现部分日志没打印的情况
   * @param {boolean} enable
   *
   */
  static setLoggerEnable(enable: boolean): void;

  /**
   * 初始化推送服务
   *
   * 请在componentDidMount()调用init,否则会影响通知点击事件的回调
   *
   */
  static init(): void;

  /**
   * 获取 RegistrationID
   *
   * 调用此 API 来取得应用程序对应的 RegistrationID。
   * 只有当应用程序成功注册到 JPush 的服务器时才返回对应的值,否则返回空字符串
   *
   */
  static getRegistrationID(callback: Callback<{ registerID: string }>): void;

  /**
   * 新增标签
   *
   * 这个接口是增加逻辑,而不是覆盖逻辑
   */
  static addTags(params: Sequence & Tags): void;

  /**
   * 覆盖标签
   *
   * 需要理解的是,这个接口是覆盖逻辑,而不是增量逻辑。即新的调用会覆盖之前的设置
   */
  static updateTags(params: Sequence & Tags): void;

  /**
   * 删除指定标签
   *
   */
  static deleteTag(params: Sequence & Tags): void;

  /**
   * 清除所有标签
   */
  static deleteTags(params: Sequence): void;

  /**
   * 查询指定 tag 与当前用户绑定的状态
   */
  static queryTag(params: Sequence & Tag): void;

  /**
   * 查询所有标签
   */
  static queryTags(params: Sequence): void;

  /**
   * 设置别名
   * 需要理解的是,这个接口是覆盖逻辑,而不是增量逻辑。即新的调用会覆盖之前的设置
   */
  static setAlias(params: Sequence & Alias): void;

  /**
   * 删除别名
   */
  static deleteAlias(params: Sequence): void;

  /**
   * 查询别名
   */
  static queryAlias(params: Sequence): void;

  //***************************************统计***************************************

  /**
   * 设置手机号码。该接口会控制调用频率,频率为 10s 之内最多 3 次
   */
  static setMobileNumber(
    params: {
      mobileNumber: string;
    } & Sequence
  ): void;

  /**
   * 开启 CrashLog 上报
   *
   */
  static initCrashHandler(): void;

  /**
   * JPush SDK 开启和关闭省电模式，默认为关闭。
   */
  static setPowerSaveMode(enable: boolean):void;

  /**
   * 检查当前应用的通知开关是否开启
   * */
  static isNotificationEnabled(callback: Callback<boolean>): void;

  //***************************************本地通知***************************************

  /**
   * 添加一个本地通知
   *
   * messageID:唯一标识通知消息的ID,可用于移除消息
   *
   * title:对应“通知标题”字段
   *
   * content:对应“通知内容”字段
   *
   * extras:对应“附加内容”字段
   *
   */
  static addLocalNotification(params: {
    messageID: string;
    title: string;
    content: string;
    extras: Extra;
  }): void;

  /**
   * 移除指定的本地通知
   *
   * messageID:唯一标识通知消息的ID,可用于移除消息
   */
  static removeLocalNotification(params: { messageID: string }): void;

  /**
   * 移除所有的本地通知
   *
   */
  static clearLocalNotifications(): void;

  /**
   * 清除所有 JPush 展现的通知（不包括非 JPush SDK 展现的）
   *
   */
  static clearAllNotifications():void;

  /**
   * 删除指定的通知
   * */
  static clearNotificationById(params: NotificationId):void;

  //***************************************地理围栏***************************************

  /**
   * 设置最多允许保存的地理围栏数量,超过最大限制后,如果继续创建先删除最早创建的地理围栏。
   * 默认数量为10个,允许设置最小1个,最大100个。
   *
   */
  static setMaxGeofenceNumber(params: { geoFenceMaxNumber: number }): void;

  /**
   * 删除指定id的地理围栏
   *
   */
  static deleteGeofence(params: { geoFenceID: string }): void;

  //***************************************接口回调***************************************

  //连接状态
  static addConnectEventListener(
    callback: Callback<{ connectEnable: boolean }>
  ): void;

  /**
   * 通知事件
   *
   * 注意：应用在存活状态下点击通知不会有跳转行为,应用在被杀死状态下点击通知会启动应用
   */
  static addNotificationListener(
    callback: Callback<{
      /**
       *  messageID:唯一标识通知消息的 ID
       */
      messageID: string;
      /**
       *  title:对应 Portal 推送通知界面上的“通知标题”字段
       */
      title: string;
      /**
       *  content:对应 Portal 推送通知界面上的“通知内容”字段
       */
      content: string;
      /**
       *  badge:对应 Portal 推送通知界面上的可选设置里面的“badge”字段 (ios only)
       */
      badge: string;
      /**
       *  ring:对应 Portal 推送通知界面上的可选设置里面的“sound”字段 (ios only)
       */
      ring: string;
      /**
       *  extras:对应 Portal 推送消息界面上的“可选设置”里的附加字段
       */
      extras: Extra;
      /**
       *  notificationEventType：分为notificationArrived和notificationOpened两种
       */
      notificationEventType: "notificationArrived" | "notificationOpened";
    }>
  ): void;

  /**
   * 本地通知事件
   *
   * 注意：应用在存活状态下点击通知不会有跳转行为,应用在被杀死状态下点击通知会启动应用
   */
  static addLocalNotificationListener(
    callback: Callback<{
      /**
       * 唯一标识通知消息的ID,可用于移除消息
       */
      messageID: string;
      /**
       * 对应“通知标题”字段
       */
      title: string;
      /**
       * 对应“通知内容”字段
       */
      content: string;
      /**
       * 对应“附加内容”字段
       */
      extras: Extra;
      notificationEventType: "notificationArrived" | "notificationOpened";
    }>
  ): void;

  /**
   * 自定义消息事件
   */
  static addCustomMessageListener(
    callback: Callback<{
      /**
       * 唯一标识自定义消息的 ID
       */
      messageID: string;
      /**
       * 对应 Portal 推送消息界面上的“自定义消息内容”字段
       */
      content: string;
      /**
       * 对应 Portal 推送消息界面上的“可选设置”里的附加字段
       */
      extras: Extra;
    }>
  ): void;

  /**
   * tag alias事件
   */
  static addTagAliasListener(
    callback: Callback<
      {
        /**
         * 结果, 0为操作成功
         */
        code: number;
      } & Sequence &
        (
          | Tags
          | Alias
          | (Tag & {
              /**
               * 执行查询指定tag(queryTag)操作时会返回是否可用
               */
              tagEnable: boolean;
            })
        )
    >
  ): void;

  /**
   * 手机号码事件
   */
  static addMobileNumberListener(
    callback: Callback<{ code: number } & Sequence>
  ): void;

  //移除事件
  static removeListener(callback: Function): void;

  //***************************************Android Only***************************************

  /**
   * 在 Android 6.0 及以上的系统上,需要去请求一些用到的权限.
   * JPush SDK 用到的一些需要请求如下权限,因为需要这些权限使统计更加精准,功能更加丰富,建议开发者调用
   * "android.permission.READ_PHONE_STATE"
   * "android.permission.ACCESS_FINE_LOCATION"
   * "android.permission.READ_EXTERNAL_STORAGE"
   * "android.permission.WRITE_EXTERNAL_STORAGE"
   *
   * @platform Android
   */
  static requestPermission(): void;

  /**
   * 停止推送服务
   *
   * @platform Android
   */
  static stopPush(): void;

  /**
   * 恢复推送服务
   *
   * @platform Android
   */
  static resumePush(): void;

  /**
   * 用来检查 Push Service 是否已经被停止
   *
   * @platform Android
   */
  static isPushStopped(callback: Callback<boolean>): void;

  /**
   * 设置允许推送时间
   *
   * 默认情况下用户在任何时间都允许推送。即任何时候有推送下来,客户端都会收到,并展示。
   * 开发者可以调用此 API 来设置允许推送的时间。
   * 如果不在该时间段内收到消息,SDK 的处理是：推送到的通知会被扔掉。
   *
   * 这是一个纯粹客户端的实现,所以与客户端时间是否准确、时区等这些,都没有关系。
   * 而且该接口仅对通知有效,自定义消息不受影响。
   *
   * @platform Android
   */
  static setPushTime(params: {
    pushTimeDays: number[];
    pushTimeStartHour: number;
    pushTimeEndHour: number;
  }): void;

  /**
   * 设置通知静默时间
   *
   * 默认情况下用户在收到推送通知时,客户端可能会有震动,响铃等提示。
   * 但用户在睡觉、开会等时间点希望为“免打扰”模式,也是静音时段的概念。
   * 开发者可以调用此 API 来设置静音时段。如果在该时间段内收到消息,则：不会有铃声和震动。
   *
   * @platform Android
   */
  static setSilenceTime(params: {
    silenceTimeStartHour: number;
    silenceTimeStartMinute: number;
    silenceTimeEndHour: number;
    silenceTimeEndMinute: number;
  }): void;

  /**
   * 设置保留最近通知条数
   *
   * 通过极光推送,推送了很多通知到客户端时,如果用户不去处理,就会有很多保留在那里。
   * 调用此 API 可以限制保留的通知条数,默认为保留最近 5 条通知。
   *
   * 仅对通知有效。所谓保留最近的,意思是,如果有新的通知到达,之前列表里最老的那条会被移除。
   * 例如,设置为保留最近 5 条通知。假设已经有 5 条显示在通知栏,当第 6 条到达时,第 1 条将会被移除。
   *
   * @platform Android
   */
  static setLatestNotificationNumber(params: {
    notificationMaxNumber: number;
  }): void;

  /**
   * 动态配置 channel,优先级比 AndroidManifest 里配置的高
   *
   * @platform Android
   */
  static setChannel(params: { channel: string }): void;

  //***************************************iOS Only***************************************

  /**
   * 设置 Badge
   *
   * @platform iOS
   */
  static setBadge(params: {
    /**
     * Push封装badge功能,允许应用上传 badge 值至 JPush 服务器,由 JPush 后台帮助管理每个用户所对应的推送 badge 值,简化了设置推送 badge 的操作。设置的值小于0时，sdk时不作处理。
     */
    badge: number;
    /**
     * iOS 用来标记应用程序状态的一个数字,出现在程序图标右上角。设置的值小于0时，sdk不作处理。
     */
    appBadge: number;
  }): void;
}
