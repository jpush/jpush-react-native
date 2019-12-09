#import <Foundation/Foundation.h>

#if __has_include(<React/RCTBridge.h>)
#import <React/RCTEventEmitter.h>
#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#elif __has_include("RCTBridge.h")
#import "RCTEventEmitter.h"
#import "RCTRootView.h"
#import "RCTBridge.h"
#endif

#import "JPUSHService.h"
#import "RCTJPushEventQueue.h"

#define J_APNS_NOTIFICATION_ARRIVED_EVENT  @"J_APNS_NOTIFICATION_ARRIVED_EVENT"
#define J_APNS_NOTIFICATION_OPENED_EVENT   @"J_APNS_NOTIFICATION_OPENED_EVENT"
#define J_LOCAL_NOTIFICATION_ARRIVED_EVENT @"J_LOCAL_NOTIFICATION_ARRIVED_EVENT"
#define J_LOCAL_NOTIFICATION_OPENED_EVENT  @"J_LOCAL_NOTIFICATION_OPENED_EVENT"
#define J_CUSTOM_NOTIFICATION_EVENT        @"J_CUSTOM_NOTIFICATION_EVENT"

@interface RCTJPushModule : RCTEventEmitter <RCTBridgeModule>

@end
