//
//  RCTJPushEventQueue.m
//  DoubleConversion
//
//  Created by wicked on 2019/9/26.
//

#import "RCTJPushEventQueue.h"

@implementation RCTJPushEventQueue

+ (instancetype)sharedInstance {
    static RCTJPushEventQueue *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self._notificationQueue = [NSMutableArray new];
        self._localNotificationQueue = [NSMutableArray new];
    }
    return self;
}


@end
