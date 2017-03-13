//
//  JPushHelper.m
//  PushDemo
//
//  Created by oshumini on 16/3/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTJPushModule.h"
#import "RCTJPushActionQueue.h"

#if __has_include(<React/RCTBridge.h>)
#import <React/RCTEventDispatcher.h>
#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#elif __has_include("RCTBridge.h")
#import "RCTEventDispatcher.h"
#import "RCTRootView.h"
#import "RCTBridge.h"
#elif __has_include("React/RCTBridge.h")
#import "React/RCTEventDispatcher.h"
#import "React/RCTRootView.h"
#import "React/RCTBridge.h"
#endif

@interface RCTJPushModule () {
  BOOL _isJPushDidLogin;
}

@end

@implementation RCTJPushModule

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

+ (id)allocWithZone:(NSZone *)zone {
  static RCTJPushModule *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (id)init {
  self = [super init];
  
  NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
  
  [defaultCenter removeObserver:self];
  
  [defaultCenter addObserver:self
                    selector:@selector(networkDidSetup:)
                        name:kJPFNetworkDidSetupNotification
                      object:nil];
  [defaultCenter addObserver:self
                    selector:@selector(networkDidClose:)
                        name:kJPFNetworkDidCloseNotification
                      object:nil];
  [defaultCenter addObserver:self
                    selector:@selector(networkDidRegister:)
                        name:kJPFNetworkDidRegisterNotification
                      object:nil];
  [defaultCenter addObserver:self
                    selector:@selector(networkDidLogin:)
                        name:kJPFNetworkDidLoginNotification
                      object:nil];
  [defaultCenter addObserver:self
                    selector:@selector(networkDidReceiveMessage:)
                        name:kJPFNetworkDidReceiveMessageNotification
                      object:nil];
  [defaultCenter addObserver:self
                    selector:@selector(receiveRemoteNotification:)
                        name:kJPFDidReceiveRemoteNotification
                      object:nil];
  
  [defaultCenter addObserver:self
                    selector:@selector(reactJSDidload)
                        name:RCTJavaScriptDidLoadNotification
                      object:nil];
  
  [defaultCenter addObserver:self
                    selector:@selector(openNotification:)
                        name:kJPFOpenNotification
                      object:nil];
  
  return self;
}

- (void)reactJSDidload {
  [RCTJPushActionQueue sharedInstance].isReactDidLoad = YES;
  [[RCTJPushActionQueue sharedInstance] scheduleNotificationQueue];
  
  if ([RCTJPushActionQueue sharedInstance].openedRemoteNotification != nil) {
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:[RCTJPushActionQueue sharedInstance].openedRemoteNotification];
  }
  
  if ([RCTJPushActionQueue sharedInstance].openedLocalNotification != nil) {
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:[RCTJPushActionQueue sharedInstance].openedLocalNotification];
  }
  
}

- (void)setBridge:(RCTBridge *)bridge {
  _bridge = bridge;
  [RCTJPushActionQueue sharedInstance].openedRemoteNotification = [_bridge.launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  [RCTJPushActionQueue sharedInstance].openedLocalNotification = [_bridge.launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
}

// request push notification permissions only
RCT_EXPORT_METHOD(setupPush) {
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    //可以添加自定义categories
    [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                      UIUserNotificationTypeSound |
                                                      UIUserNotificationTypeAlert)
                  categories:nil];
    } else {
      //categories 必须为nil
      [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                        UIRemoteNotificationTypeSound |
                                                        UIRemoteNotificationTypeAlert)
                    categories:nil];
    }
}

- (void)openNotification:(NSNotification *)notification {
  id obj = [notification object];
  [self.bridge.eventDispatcher sendAppEventWithName:@"OpenNotification" body:obj];
}

- (void)networkDidSetup:(NSNotification *)notification {
  [self.bridge.eventDispatcher sendAppEventWithName:@"networkDidSetup"
                                               body:nil];
}

- (void)networkDidClose:(NSNotification *)notification {
  [self.bridge.eventDispatcher sendAppEventWithName:@"networkDidClose"
                                               body:nil];
}

- (void)networkDidRegister:(NSNotification *)notification {
  [self.bridge.eventDispatcher sendAppEventWithName:@"networkDidRegister"
                                               body:nil];
}

- (void)networkDidLogin:(NSNotification *)notification {
  _isJPushDidLogin = YES;
  [[RCTJPushActionQueue sharedInstance] scheduleGetRidCallbacks];
  [self.bridge.eventDispatcher sendAppEventWithName:@"networkDidLogin"
                                               body:nil];
}

- (void)networkDidReceiveMessage:(NSNotification *)notification {
  [self.bridge.eventDispatcher sendAppEventWithName:@"networkDidReceiveMessage"
                                               body:[notification userInfo]];
}

- (void)receiveRemoteNotification:(NSNotification *)notification {

  if ([RCTJPushActionQueue sharedInstance].isReactDidLoad == YES) {
    id obj = [notification object];
    [self.bridge.eventDispatcher sendAppEventWithName:@"ReceiveNotification" body:obj];
  } else {
    [[RCTJPushActionQueue sharedInstance] postNotification:notification];
  }
  
}


- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (void)didRegistRemoteNotification:(NSString *)token {
  [self.bridge.eventDispatcher sendAppEventWithName:@"didRegisterToken"
                                               body:token];
}

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location callback:(RCTResponseSenderBlock)callback) {
  callback(@[name]);
}

///----------------------------------------------------
/// @name Setup 启动相关
///----------------------------------------------------
//
///*!
// * @abstract 启动SDK
// *
// * @discussion 这是旧版本的启动方法, 依赖于 PushConfig.plist 文件. 建议不要使用, 已经过期.
// */
//RCT_EXPORT_METHOD(setupWithOption:(NSDictionary *)launchingOption __attribute__((deprecated("JPush 2.1.0 版本已过期")))) {
//
//}

/*!
 * @abstract 启动SDK
 *
 * @param launchingOption 启动参数.
 * @param appKey 一个JPush 应用必须的,唯一的标识. 请参考 JPush 相关说明文档来获取这个标识.
 * @param channel 发布渠道. 可选.
 * @param isProduction 是否生产环境. 如果为开发状态,设置为 NO; 如果为生产状态,应改为 YES.
 *
 * @discussion 提供SDK启动必须的参数, 来启动 SDK.
 * 此接口必须在 App 启动时调用, 否则 JPush SDK 将无法正常工作.
 */
RCT_EXPORT_METHOD(setupWithOption:(NSDictionary *)launchingOption
                  appKey:(NSString *)appKey
                  channel:(NSString *)channel
                  apsForProduction:(BOOL)isProduction) {

}


///----------------------------------------------------
/// @name APNs about 通知相关
///----------------------------------------------------

/*!
 * @abstract 注册要处理的远程通知类型
 *
 * @param types 通知类型
 * @param categories
 *
 * @discussion
 */
RCT_EXPORT_METHOD(registerForRemoteNotificationTypes:(NSUInteger)types
                  categories:(NSSet *)categories) {
  [JPUSHService registerForRemoteNotificationTypes:types categories:categories];
}

RCT_EXPORT_METHOD(registerDeviceToken:(NSData *)deviceToken) {
  [JPUSHService registerDeviceToken:deviceToken];
}

/*!
 * @abstract 处理收到的 APNs 消息
 */
RCT_EXPORT_METHOD(handleRemoteNotification:(NSDictionary *)remoteInfo) {
  [JPUSHService handleRemoteNotification:remoteInfo];
}


/*!
 * 设置 tags 的方法
 */
RCT_EXPORT_METHOD( setTags:(NSArray *)tags
                  callback:(RCTResponseSenderBlock)callback) {

  NSSet *tagSet;

  if (tags != NULL) {
    tagSet = [NSSet setWithArray:tags];
  }

  self.asyCallback = callback;

  [JPUSHService setTags:tagSet alias:nil fetchCompletionHandle:^(int iResCode, NSSet *iTags, NSString *iAlias) {
    callback(@[@(iResCode)]);
  }];
}

/*!
 * 设置 Alias 的方法
 */
RCT_EXPORT_METHOD( setAlias:(NSString *)alias
                  callback:(RCTResponseSenderBlock)callback) {

  NSString *aliasString;

  self.asyCallback = callback;

  [JPUSHService setTags:nil alias:alias fetchCompletionHandle:^(int iResCode, NSSet *iTags, NSString *iAlias) {
    callback(@[@(iResCode)]);
  }];
}

/*!
 * @abstract 过滤掉无效的 tags
 *
 * @discussion 如果 tags 数量超过限制数量, 则返回靠前的有效的 tags.
 * 建议设置 tags 前用此接口校验. SDK 内部也会基于此接口来做过滤.
 */
RCT_EXPORT_METHOD(filterValidTags:(NSSet *)tags callback:(RCTResponseSenderBlock)callback) {// -> nsset
  NSArray *arr = [[JPUSHService filterValidTags:tags] allObjects];
  callback(arr);
}


///----------------------------------------------------
/// @name Stats 统计功能
///----------------------------------------------------

/*!
 * @abstract 开始记录页面停留
 *
 * @param pageName 页面名称
 */
RCT_EXPORT_METHOD(startLogPageView:(NSString *)pageName) {
  [JPUSHService startLogPageView:pageName];
}

/*!
 * @abstract 停止记录页面停留
 *
 * @param pageName 页面
 */
RCT_EXPORT_METHOD(stopLogPageView:(NSString *)pageName) {
  [JPUSHService stopLogPageView:pageName];
}

/*!
 * @abstract 直接上报在页面的停留时工
 *
 * @param pageName 页面
 * @param seconds 停留的秒数
 */
RCT_EXPORT_METHOD(beginLogPageView:(NSString *)pageName duration:(int)seconds) {
  [JPUSHService beginLogPageView:pageName duration:seconds];
}

/*!
 * @abstract 开启Crash日志收集
 *
 * @discussion 默认是关闭状态.
 */
RCT_EXPORT_METHOD(crashLogON) {
  [JPUSHService crashLogON];
}

/*!
 * @abstract 地理位置上报
 *
 * @param latitude 纬度.
 * @param longitude 经度.
 *
 */
RCT_EXPORT_METHOD(setLatitude:(double)latitude longitude:(double)longitude) {
  [JPUSHService setLatitude:latitude longitude:longitude];
}

/*!
 * @abstract 地理位置上报
 *
 * @param location 直接传递 CLLocation * 型的地理信息
 *
 * @discussion 需要链接 CoreLocation.framework 并且 #import <CoreLocation/CoreLocation.h>
 */
RCT_EXPORT_METHOD(setLocation:(CLLocation *)location) {
  [JPUSHService setLocation:location];
}


///----------------------------------------------------
/// @name Local Notification 本地通知
///----------------------------------------------------

/*!
 * @abstract 本地推送，最多支持64个
 *
 * @param fireDate 本地推送触发的时间
 * @param alertBody 本地推送需要显示的内容
 * @param badge 角标的数字。如果不需要改变角标传-1
 * @param alertAction 弹框的按钮显示的内容（IOS 8默认为"打开", 其他默认为"启动"）
 * @param notificationKey 本地推送标示符
 * @param userInfo 自定义参数，可以用来标识推送和增加附加信息
 * @param soundName 自定义通知声音，设置为nil为默认声音
 *
 * @discussion 最多支持 64 个定义
 */
RCT_EXPORT_METHOD( setLocalNotification:(NSDate *)fireDate
                  alertBody:(NSString *)alertBody
                  badge:(int)badge
                  alertAction:(NSString *)alertAction
                  identifierKey:(NSString *)notificationKey
                  userInfo:(NSDictionary *)userInfo
                  soundName:(NSString *)soundName) {

  [JPUSHService setLocalNotification:fireDate
                           alertBody:alertBody
                               badge:badge
                         alertAction:alertAction
                       identifierKey:notificationKey
                            userInfo:userInfo
                           soundName:soundName];
}


/*!
 * @abstract 前台展示本地推送
 *
 * @param notification 本地推送对象
 * @param notificationKey 需要前台显示的本地推送通知的标示符
 *
 * @discussion 默认App在前台运行时不会进行弹窗，在程序接收通知调用此接口可实现指定的推送弹窗。
 */
RCT_EXPORT_METHOD( showLocalNotificationAtFront:(UILocalNotification *)notification
                  identifierKey:(NSString *)notificationKey) {
  [JPUSHService showLocalNotificationAtFront:notification identifierKey:notificationKey];
}
/*!
 * @abstract 删除本地推送定义
 *
 * @param notificationKey 本地推送标示符
 * @param myUILocalNotification 本地推送对象
 */
RCT_EXPORT_METHOD(deleteLocalNotificationWithIdentifierKey:(NSString *)notificationKey) {
  [JPUSHService deleteLocalNotificationWithIdentifierKey:notificationKey];
}

/*!
 * @abstract 删除本地推送定义
 */
RCT_EXPORT_METHOD(deleteLocalNotification:(UILocalNotification *)localNotification) {
  [JPUSHService deleteLocalNotification:localNotification];
}

/*!
 * @abstract 获取指定通知
 *
 * @param notificationKey 本地推送标示符
 * @return 本地推送对象数组, [array count]为0时表示没找到
 */
RCT_EXPORT_METHOD(findLocalNotificationWithIdentifier:(NSString *)notificationKey callback:(RCTResponseSenderBlock)callback) {// nsarray
  callback([JPUSHService findLocalNotificationWithIdentifier:notificationKey]);
}

/*!
 * @abstract 清除所有本地推送对象
 */
RCT_EXPORT_METHOD(clearAllLocalNotifications) {
  [JPUSHService clearAllLocalNotifications];
}


///----------------------------------------------------
/// @name Server badge 服务器端 badge 功能
///----------------------------------------------------

/*!
 * @abstract 设置角标(到服务器)
 *
 * @param value 新的值. 会覆盖服务器上保存的值(这个用户)
 *
 * @discussion 本接口不会改变应用本地的角标值.
 * 本地仍须调用 UIApplication:setApplicationIconBadgeNumber 函数来设置脚标.
 *
 * 本接口用于配合 JPush 提供的服务器端角标功能.
 * 该功能解决的问题是, 服务器端推送 APNs 时, 并不知道客户端原来已经存在的角标是多少, 指定一个固定的数字不太合理.
 *
 * JPush 服务器端脚标功能提供:
 *
 * - 通过本 API 把当前客户端(当前这个用户的) 的实际 badge 设置到服务器端保存起来;
 * - 调用服务器端 API 发 APNs 时(通常这个调用是批量针对大量用户),
 *   使用 "+1" 的语义, 来表达需要基于目标用户实际的 badge 值(保存的) +1 来下发通知时带上新的 badge 值;
 */
RCT_EXPORT_METHOD(setBadge:(NSInteger)value callback:(RCTResponseSenderBlock)callback) {// ->Bool
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:value];
  NSNumber *badgeNumber = [NSNumber numberWithBool:[JPUSHService setBadge: value]];
  callback(@[badgeNumber]);
}

/*!
 * @abstract 重置脚标(为0)
 *
 * @discussion 相当于 [setBadge:0] 的效果.
 * 参考 [JPUSHService setBadge:] 说明来理解其作用.
 */
RCT_EXPORT_METHOD(resetBadge) {
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber: 0];
  [JPUSHService resetBadge];
}


///----------------------------------------------------
/// @name Logs and others 日志与其他
///----------------------------------------------------

/*!
 * @abstract JPush标识此设备的 registrationID
 *
 * @discussion SDK注册成功后, 调用此接口获取到 registrationID 才能够获取到.
 *
 * JPush 支持根据 registrationID 来进行推送.
 * 如果你需要此功能, 应该通过此接口获取到 registrationID 后, 上报到你自己的服务器端, 并保存下来.
 *
 * 更多的理解请参考 JPush 的文档网站.
 */
RCT_EXPORT_METHOD(getRegistrationID:(RCTResponseSenderBlock)callback) {// -> string
#if TARGET_IPHONE_SIMULATOR//模拟器
  NSLog(@"simulator can not get registrationid");
  callback(@[@""]);
#elif TARGET_OS_IPHONE//真机
  if (_isJPushDidLogin) {
    callback(@[[JPUSHService registrationID]]);
  } else {
    [[RCTJPushActionQueue sharedInstance] postGetRidCallback:callback];
  }
  
#endif

}

/*!
 * @abstract 打开日志级别到 Debug
 *
 * @discussion JMessage iOS 的日志系统参考 Android 设计了级别.
 * 从低到高是: Verbose, Debug, Info, Warning, Error.
 * 对日志级别的进一步理解, 请参考 Android 相关的说明.
 *
 * SDK 默认开启的日志级别为: Info. 只显示必要的信息, 不打印调试日志.
 *
 * 调用本接口可打开日志级别为: Debug, 打印调试日志.
 */
RCT_EXPORT_METHOD(setDebugMode) {
  [JPUSHService setDebugMode];
}

/*!
 * @abstract 关闭日志
 *
 * @discussion 关于日志级别的说明, 参考 [JPUSHService setDebugMode]
 *
 * 虽说是关闭日志, 但还是会打印 Warning, Error 日志. 这二种日志级别, 在程序运行正常时, 不应有打印输出.
 *
 * 建议在发布的版本里, 调用此接口, 关闭掉日志打印.
 */
RCT_EXPORT_METHOD(setLogOFF) {
  [JPUSHService setLogOFF];
}


@end
