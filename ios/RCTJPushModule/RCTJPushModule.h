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

#define J_APNS_NOTIFICATION_ARRIVED_EVENT @"J_APNS_NOTIFICATION_ARRIVED_EVENT"
#define J_APNS_NOTIFICATION_OPENED_EVENT  @"J_APNS_NOTIFICATION_OPENED_EVENT"
#define J_CUSTOM_NOTIFICATION_EVENT       @"J_CUSTOM_NOTIFICATION_EVENT"
#define J_LOCAL_NOTIFICATION_EVENT        @"J_LOCAL_NOTIFICATION_EVENT"

#define LOCAL_BADGE @"localBadge"   // 可用来设置本地角标传参

// 本地通知
#define LOCAL_NOTIFICATION_TRIGGER_YEAR   @"LocalNotificationTriggerYear"
#define LOCAL_NOTIFICATION_TRIGGER_MONTH   @"LocalNotificationTriggerMonth"
#define LOCAL_NOTIFICATION_TRIGGER_DAY   @"LocalNotificationTriggerDay"
#define LOCAL_NOTIFICATION_TRIGGER_HOUR   @"LocalNotificationTriggerHour"
#define LOCAL_NOTIFICATION_TRIGGER_MINUTE   @"LocalNotificationTriggerMinute"
#define LOCAL_NOTIFICATION_TRIGGER_SECOND   @"LocalNotificationTriggerSecond"
#define LOCAL_NOTIFICATION_TRIGGER_TIME_SINCE_NOW   @"LocalNotificationTriggerTimeSinceNow"

#define LOCAL_NOTIFICATION_TRIGGER_LATITUDE   @"LocalNotificationTriggerLatitude"
#define LOCAL_NOTIFICATION_TRIGGER_LONGITUDE   @"LocalNotificationTriggerLongitude"
#define LOCAL_NOTIFICATION_TRIGGER_RADIUS   @"LocalNotificationTriggerRadius"
#define LOCAL_NOTIFICATION_TRIGGER_IDENTIFIER   @"LocalNotificationTriggerIdentifier"

#define LOCAL_NOTIFICATION_TRIGGER_REPEAT   @"LocalNotificationTriggerRepeat"

#define LOCAL_NOTIFICATION_CONTENT_TITLE   @"LocalNotificationContentTitle"
#define LOCAL_NOTIFICATION_CONTENT_SUBTITLE   @"LocalNotificationContentSubTitle"
#define LOCAL_NOTIFICATION_CONTENT_BODY   @"LocalNotificationContentBody"
#define LOCAL_NOTIFICATION_CONTENT_BADGE   @"LocalNotificationContentBadge"
#define LOCAL_NOTIFICATION_CONTENT_ACTION   @"LocalNotificationContentAction"
#define LOCAL_NOTIFICATION_CONTENT_CATEGORY_IDENTIFIER   @"LocalNotificationContentCategoryIdentifier"
#define LOCAL_NOTIFICATION_CONTENT_THREAD_IDENTIFIER   @"LocalNotificationContentThreadIdentifier"
#define LOCAL_NOTIFICATION_CONTENT_USER_INFO   @"LocalNotificationContentUserInfo"
#define LOCAL_NOTIFICATION_CONTENT_SOUND   @"LocalNotificationContentSound"
#define LOCAL_NOTIFICATION_CONTENT_SUMMARY_ARGUMENT   @"LocalNotificationContentSummaryArgument"
#define LOCAL_NOTIFICATION_CONTENT_SUMMARY_ARGUMENT_COUNT   @"LocalNotificationContentSummaryArgumentCount"

#define LOCAL_NOTIFICATION_REQUEST_IDENTIFIER   @"LocalNotificationRequestIdentifier"
#define LOCAL_NOTIFICATION_REQUEST_COMPLETION   @"LocalNotificationRequestCompletion"

#define LOCAL_NOTIFICATION_IDENTIFIER_DELIVERED   @"LocalNotificationIdentifierDelivered"
#define LOCAL_NOTIFICATION_FIND_COMPLETION   @"LocalNotificationFindCompletion"

@interface RCTJPushModule : RCTEventEmitter <RCTBridgeModule>

@end
