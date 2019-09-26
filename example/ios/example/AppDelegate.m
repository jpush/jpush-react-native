/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <RCTJPushModule.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
  // JPush初始化配置
  [JPUSHService setupWithOption:launchOptions appKey:@"129c21dc4cb5e6f6de194003"
                        channel:@"dev" apsForProduction:YES];
  // APNS
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  [launchOptions objectForKey: UIApplicationLaunchOptionsRemoteNotificationKey];
  // 自定义消息
  NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
  [defaultCenter addObserver:self selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidReceiveMessageNotification object:nil];
  // 地理围栏
  [JPUSHService registerLbsGeofenceDelegate:self withLaunchOptions:launchOptions];
  // ReactNative环境配置
  NSURL *jsCodeLocation = [NSURL URLWithString:@"http://10.224.36.135:8081/index.bundle?platform=ios&dev=true"];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"example"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

//************************************************JPush start************************************************

//注册 APNS 成功并上报 DeviceToken
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}

//iOS 7 APNS
- (void)application:(UIApplication *)application didReceiveRemoteNotification:  (NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  // iOS 10 以下 Required
  NSLog(@"iOS 7 APNS");
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  completionHandler(UIBackgroundFetchResultNewData);
}

//ios 4 本地通知 todo
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification{
  NSDictionary *userInfo =  notification.userInfo;
  NSLog(@"iOS 4 本地通知");
  [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_EVENT object:userInfo];
}

//iOS 10 前台收到消息
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center  willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    // Apns
    NSLog(@"iOS 10 APNS 前台收到消息");
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  }
  else {
    // 本地通知 todo
    NSLog(@"iOS 10 本地通知 前台收到消息");
    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_EVENT object:userInfo];
  }
  completionHandler(UNNotificationPresentationOptionAlert);// 需要执行这个方法，选择是否提醒用户，有 Badge、Sound、Alert 三种类型可以选择设置
}

//iOS 10 消息事件回调
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler: (void (^)())completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    NSLog(@"iOS 10 APNS 消息事件回调");
    // Apns
    [JPUSHService handleRemoteNotification:userInfo];
    // 保障应用被杀死状态下，用户点击推送消息，打开app后可以收到点击通知事件
    [[RCTJPushEventQueue sharedInstance]._notificationQueue insertObject:userInfo atIndex:0];
    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_OPENED_EVENT object:userInfo];
  }
  else {
    // 本地通知 todo
    NSLog(@"iOS 10 本地通知 消息事件回调");
    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_EVENT object:userInfo];
  }
  // 系统要求执行这个方法
  completionHandler();
}

//自定义消息
- (void)networkDidReceiveMessage:(NSNotification *)notification {
  NSDictionary * userInfo = [notification userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:J_CUSTOM_NOTIFICATION_EVENT object:userInfo];
}

//************************************************JPush end************************************************

@end
