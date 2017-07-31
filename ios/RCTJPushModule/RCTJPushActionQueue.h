//
//  RCTJPushActionQueue.h
//  RCTJPushModule
//
//  Created by oshumini on 2016/12/19.
//  Copyright © 2016年 HXHG. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTJPushModule.h"

@interface RCTJPushActionQueue : NSObject

@property BOOL isReactDidLoad;
@property NSDictionary* openedRemoteNotification;
@property NSDictionary* openedLocalNotification;
@property(strong,nonatomic)NSMutableArray<RCTResponseSenderBlock>* getRidCallbackArr;

+ (nonnull instancetype)sharedInstance;

- (void)postNotification:(NSNotification *)notification;
- (void)scheduleNotificationQueue;

- (void)postGetRidCallback:(RCTResponseSenderBlock) getRidCallback;
- (void)scheduleGetRidCallbacks;
@end
