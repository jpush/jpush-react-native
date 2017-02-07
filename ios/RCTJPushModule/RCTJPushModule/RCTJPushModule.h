//
//  JPushHelper.h
//  PushDemo
//
//  Created by oshumini on 16/3/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import "JPUSHService.h"

#define kJPFDidReceiveRemoteNotification  @"kJPFDidReceiveRemoteNotification"

#define kJPFOpenNotification @"kJPFOpenNotification" // 通过点击通知 Notification 启动应用

@interface RCTJPushModule : NSObject <RCTBridgeModule>
@property(strong,nonatomic)RCTResponseSenderBlock asyCallback;

- (void)didRegistRemoteNotification:(NSString *)token;
@end
