//
//  JPushHelper.m
//  PushDemo
//
//  Created by oshumini on 16/3/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "JPushHelper.h"
#import "RCTEventDispatcher.h"
#import "RCTRootView.h"
#import "AppDelegate.h"
#import "RCTBridge.h"

@implementation JPushHelper

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;
//@synthesize myname = _myname;
//+ (JPushHelper *)shareInstance {
//  static JPushHelper *jpushManager = nil;
////  static dispatch_once_t onceToken;
////  dispatch_once(&onceToken, ^{
////    jpushManager = [[JPushHelper alloc] init];
////  });
//  if (jpushManager == nil) {
//    jpushManager = [[JPushHelper alloc] init];  
//  }
//  return jpushManager;
//}

+ (id)allocWithZone:(NSZone *)zone {
  static JPushHelper *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (void)didRegistRemoteNotification:(NSString *)token {
  [self.bridge.eventDispatcher sendAppEventWithName:@"didRegisterToken"
                                               body:token];
}

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{

}
@end
