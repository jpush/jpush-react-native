# 3.3.0候选：原生SDK与新增接口

当前为本地候选，尚未发布。Android/iOS JPush升级至6.3.0、JCore至5.6.0；需配套jcore-react-native>=2.3.8并重新编译原生应用。Core须先发布并在npm可见，再发布主插件；当前不要从公开registry安装尚未发布候选。

## 平台与异步契约

| JS入口 | Android | iOS | 返回/边界 |
| --- | --- | --- | --- |
| addVoipEventListener(callback) | 支持 | 不支持 | void监听，removeListener移除；messageId/extraData/platform/voipSupportStatus原样传递，不支持平台同步throw |
| requestSubscribeChannels(channelIds) | 支持 | 不支持 | Promise<void>仅确认派发；最终addCommandEventListener事件command=2013；需前台且有焦点Activity，1–3个唯一非空白字符串 |
| turnOffPush() | UPS回调 | SDK完成回调 | Promise<{code:number}>，保留原生非零业务码；与既有stopPush/resumePush不同 |
| turnOnPush() | UPS回调 | 仅派发 | Promise<{dispatched:true,code?:number}>；Android含真实原生code，iOS不伪造code，dispatched不代表已联网或可收到通知 |
| stopCrashHandler() | 支持 | 不支持 | void，与已有initCrashHandler配对；从不自动启用。原initCrashHandler及其iOS crashLogON行为不变 |
| setLiveActivityTokenReportEnabled(enable) | 不支持 | 支持 | Promise<void>，严格boolean；仅诊断埋点，不改变Token绑定、解绑或业务回调 |
| registerLiveActivityPushToken(params) | 不支持 | iOS16.1+ | Promise<LiveActivityResult>；activityId+token+sequence，结束时token:null解绑 |
| registerLiveActivityPushToStartToken(params) | 不支持 | iOS17.2+ | Promise<LiveActivityResult>；activityAttributes+token+sequence，token:null解绑 |

新Promise入口不支持平台时拒绝UNSUPPORTED_PLATFORM，系统版本不满足时UNSUPPORTED_OS；新void stopCrashHandler在不支持平台同步throw（error.code同为UNSUPPORTED_PLATFORM）。参数错误INVALID_ARGUMENT，缺前台Activity为NO_ACTIVITY，过旧/未重编NativeModule为NATIVE_MODULE_UNAVAILABLE，原生调用异常NATIVE_EXCEPTION。SDK返回非零code为业务结果，Promise仍resolve，由业务明确处理。正常回调逐调用独立、忽略重复；Bridge销毁会释放旧Promise引用并忽略迟到回调，销毁中的旧JS调用不保证完成，不能带到新Bridge复用。

旧requestSubscribeChannel与command2012/openChannelResult/platform保持兼容。新2013保留旧commandExtra字符串，另提供commandData递归类型数据及channels；channels若SDK传JSON字符串则仍为字符串，数组/对象/布尔/数字保持相应JS类型，不统一转字符串。JS number遵循其精度范围；内部intent_附加对象不暴露，不将任意native对象toString。无2013字段时不猜造最终订阅结果。

```js
const onCommand = event => {
  if (event.command !== 2013) return;
  const channels = typeof event.channels === 'string'
    ? JSON.parse(event.channels) : event.channels;
  // 根据commandResult与各channel code处理结果；不能以派发Promise当用户已同意订阅。
};
JPush.addCommandEventListener(onCommand);
await JPush.requestSubscribeChannels(['YOUR_APPROVED_CHANNEL_ID']);
// 页面销毁：JPush.removeListener(onCommand)
const paused = await JPush.turnOffPush();
if (paused.code !== 0) { /* 处理原生业务错误 */ }
const restored = await JPush.turnOnPush();
// iOS此处仅确认派发；请继续观察连接/注册事件。
```

## Live Activity Token与诊断

两个业务token入口原生6.2.0已存在，是本轮补齐的相关旧桥接缺口；诊断开关是本次SDK新增。Token必须由应用自身ActivityKit生命周期取得并在变化时更新；传入偶数长度十六进制字符串（大小写均可）或null，空字符串/缺字段不是解绑；不要记录或展示token。sequence为[-2147483648,2147483647]整数。结果类型：{code,activityId:string|null,token:string|null,sequence}，token为原生回调NSData转换的hex/null，保留原生返回的code/id/seq而非猜造；本库不创建或结束ActivityKit Activity。

```js
await JPush.registerLiveActivityPushToStartToken({
  activityAttributes: 'YourActivityAttributes', token: activityKitStartTokenHex, sequence: 1
});
await JPush.registerLiveActivityPushToken({
  activityId, token: activityKitPushTokenHex, sequence: 2
});
// Activity结束时解绑：
await JPush.registerLiveActivityPushToken({activityId, token: null, sequence: 3});
```

setLiveActivityTokenReportEnabled默认不自动开启。它与服务端诊断开关独立：任一开启即可能上报，两者均关闭才停止；关闭本地开关不表示已解绑Token，也不保证服务端开关关闭。显式true/false只控制诊断链路。

## 集成与验证边界

Android两模块minSdk23、iOS Pod声明7.0及原RN peer范围未提高；代表性example为RN0.74.1。声明不等于最低系统已经运行验证；Live Activity入口具有独立OS保护。Core Pod继续精确JCore5.6.0，无新增noidfa变体选项；不要套用其它插件的Pod宽范围方案。

真实AppKey、厂商密钥、证书和Token由宿主安全配置提供，不预埋于插件。示例新增功能仅点击时调用，涉及采集/停推的按钮会改变测试应用状态，请在明确的测试应用验证并按需恢复；订阅结果需支持的厂商/授权条件。当前验证通过和未覆盖范围由实际交付记录说明，不能以版本字符串或单元mock当真机通过。

Android6.3.0新增VoipDataMessage支持状态字段；本轮补齐Android VoipMessageEvent，voipSupportStatus为原生整数，保留未知值，不推断布尔值，也不日志输出VoIP内容。SDK厂商SPI JThirdPlatFormInterface的unregister/订阅事件用于厂商接入，不作为JS业务接口。UPS新增原生错误码由code:number原样返回，不发明双端通用码。

新增VoIP监听按callback函数身份管理：同一callback重复注册幂等，不会叠加句柄；不同闭包即使源码相同仍是独立订阅。组件卸载使用同一callback调用removeListener。其它旧事件注册行为保持原实现。

JPush6.3.0含Swift静态对象；Podspec为纯Objective-C宿主补继承的Swift工具链/SDK库搜索路径及ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES，避免Swift兼容库缺失链接失败。未新增Swift源码、未提高deployment target；更新后重新pod install使配置生效。
