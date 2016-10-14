//
//  JPushHelper.h
//  PushDemo
//
//  Created by oshumini on 16/3/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "JPUSHService.h"

#define kJPFDidReceiveRemoteNotification  @"kJPFDidReceiveRemoteNotification"


@interface RCTJPushModule : NSObject <RCTBridgeModule>
@property(strong,nonatomic)RCTResponseSenderBlock asyCallback;

- (void)didRegistRemoteNotification:(NSString *)token;
@end
