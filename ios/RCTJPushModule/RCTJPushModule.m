#import "RCTJPushModule.h"
#import <CoreLocation/CoreLocation.h>

//常量
#define CODE           @"code"
#define BADGE          @"badge"
#define SEQUENCE       @"sequence"
#define REGISTER_ID    @"registerID"
#define MOBILE_NUMBER  @"mobileNumber"
#define CONNECT_ENABLE @"connectEnable"

//通知消息
#define MESSAGE_ID @"messageID"
#define TITLE      @"title"
#define CONTENT    @"content"
#define EXTRAS     @"extras"
#define BADGE      @"badge"
#define RING       @"ring"
#define BROADCASTTIME @"broadcastTime"

//本地角标
#define APP_BADGE @"appBadge"

//tagAlias
#define TAG         @"tag"
#define TAGS        @"tags"
#define TAG_ENABLE  @"tagEnable"

#define ALIAS       @"alias"

//properties
#define PROS        @"pros"

//地理围栏
#define GEO_FENCE_ID         @"geoFenceID"
#define GEO_FENCE_MAX_NUMBER @"geoFenceMaxNumber"

//通知事件类型
#define NOTIFICATION_EVENT_TYPE   @"notificationEventType"
#define NOTIFICATION_ARRIVED      @"notificationArrived"
#define NOTIFICATION_OPENED       @"notificationOpened"
#define NOTIFICATION_DISMISSED    @"notificationDismissed"
//通知消息事件
#define NOTIFICATION_EVENT        @"NotificationEvent"
//自定义消息
#define CUSTOM_MESSAGE_EVENT      @"CustomMessageEvent"
//应用内消息事件类型
#define INAPP_MESSAGE_EVENT_TYPE   @"inappEventType"
#define INAPP_MESSAGE_SHOW         @"inappShow"
#define INAPP_MESSAGE_CLICK        @"inappClick"
//应用内消息
#define INAPP_MESSAGE_EVENT       @"InappMessageEvent"
//本地通知
#define LOCAL_NOTIFICATION_EVENT  @"LocalNotificationEvent"
//连接状态
#define CONNECT_EVENT             @"ConnectEvent"
//tag alias
#define TAG_ALIAS_EVENT           @"TagAliasEvent"
//properties
#define PROPERTIES_EVENT           @"PropertiesEvent"
//phoneNumber
#define MOBILE_NUMBER_EVENT       @"MobileNumberEvent"


@interface RCTJPushModule ()

@end

@implementation RCTJPushModule

RCT_EXPORT_MODULE(JPushModule);

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (id)init
{
    self = [super init];
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    
    [defaultCenter removeObserver:self];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendApnsNotificationEvent:)
                          name:J_APNS_NOTIFICATION_ARRIVED_EVENT
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendApnsNotificationEvent:)
                          name:J_APNS_NOTIFICATION_OPENED_EVENT
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendLocalNotificationEvent:)
                          name:J_LOCAL_NOTIFICATION_ARRIVED_EVENT
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendLocalNotificationEvent:)
                          name:J_LOCAL_NOTIFICATION_OPENED_EVENT
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendCustomNotificationEvent:)
                          name:J_CUSTOM_NOTIFICATION_EVENT
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendConnectEvent:)
                          name:kJPFNetworkDidCloseNotification
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendConnectEvent:)
                          name:kJPFNetworkFailedRegisterNotification
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendConnectEvent:)
                          name:kJPFNetworkDidLoginNotification
                        object:nil];
    
    return self;
}


RCT_EXPORT_METHOD(setDebugMode: (BOOL *)enable)
{
    if(enable){
        [JPUSHService setDebugMode];
    }
}

RCT_EXPORT_METHOD(setupWithConfig:(NSDictionary *)params)
{
    if (params[@"appKey"] && params[@"channel"] && params[@"production"]) {
           // JPush初始化配置
           NSMutableDictionary *launchOptions = [NSMutableDictionary dictionaryWithDictionary:self.bridge.launchOptions];
           [JPUSHService setupWithOption:launchOptions appKey:params[@"appKey"]
                                 channel:params[@"channel"] apsForProduction:[params[@"production"] boolValue]];

           dispatch_async(dispatch_get_main_queue(), ^{
               // APNS
               JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
               if (@available(iOS 12.0, *)) {
                 entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
               }
               [JPUSHService registerForRemoteNotificationConfig:entity delegate:self.bridge.delegate];
               [launchOptions objectForKey: UIApplicationLaunchOptionsRemoteNotificationKey];
               // 自定义消息
               NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
               [defaultCenter addObserver:self.bridge.delegate selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidReceiveMessageNotification object:nil];
               // 地理围栏
               [JPUSHService registerLbsGeofenceDelegate:self.bridge.delegate withLaunchOptions:launchOptions];
               // 应用内消息
               [JPUSHService setInAppMessageDelegate:self];
           });

           NSMutableArray *notificationList = [RCTJPushEventQueue sharedInstance]._notificationQueue;
           if(notificationList.count) {
               [self sendApnsNotificationEventByDictionary:notificationList[0]];
           }
           NSMutableArray *localNotificationList = [RCTJPushEventQueue sharedInstance]._localNotificationQueue;
           if(localNotificationList.count) {
               [self sendLocalNotificationEventByDictionary:localNotificationList[0]];
           }
       }
}


RCT_EXPORT_METHOD(loadJS)
{
    NSMutableArray *notificationList = [RCTJPushEventQueue sharedInstance]._notificationQueue;
    if(notificationList.count) {
        [self sendApnsNotificationEventByDictionary:notificationList[0]];
    }
    NSMutableArray *localNotificationList = [RCTJPushEventQueue sharedInstance]._localNotificationQueue;
    if(localNotificationList.count) {
        [self sendLocalNotificationEventByDictionary:localNotificationList[0]];
    }
}

RCT_EXPORT_METHOD(getRegisterId:(RCTResponseSenderBlock) callback)
{
    [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
        NSMutableDictionary *response = [[NSMutableDictionary alloc] init];
        [response setValue:registrationID?registrationID:@"" forKey:REGISTER_ID];
        callback(@[response]);
    }];
}

RCT_EXPORT_METHOD(isNotificationEnabled:(RCTResponseSenderBlock) callback) {
    [JPUSHService requestNotificationAuthorization:^(JPAuthorizationStatus status) {
        if (status <= JPAuthorizationStatusDenied) {
            callback(@[@(NO)]);
        }else {
            callback(@[@(YES)]);
        }
    }];
}

//tag
RCT_EXPORT_METHOD(addTags:(NSDictionary *)params)
{
    if([params[@"tags"] isKindOfClass:[NSArray class]]){
        NSArray *tags = [params[TAGS] copy];
        if (tags != NULL) {
            NSSet *tagSet = [NSSet setWithArray:tags];
            NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
            [JPUSHService addTags:tagSet completion:^(NSInteger iResCode, NSSet *iTags, NSInteger seq) {
                NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),TAGS:[iTags allObjects]};
                [self sendTagAliasEvent:data];
            } seq:sequence];
        }
    }
}

RCT_EXPORT_METHOD(setTags:(NSDictionary *)params)
{
    if([params[@"tags"] isKindOfClass:[NSArray class]]){
        NSArray *tags = [params[TAGS] copy];
        if (tags != NULL) {
            NSSet *tagSet = [NSSet setWithArray:tags];
            NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
            [JPUSHService setTags:tagSet completion:^(NSInteger iResCode, NSSet *iTags, NSInteger seq) {
                NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),TAGS:[iTags allObjects]};
                [self sendTagAliasEvent:data];
            } seq:sequence];
        }
    }
}

RCT_EXPORT_METHOD(deleteTags:(NSDictionary *)params)
{
    if([params[@"tags"] isKindOfClass:[NSArray class]]){
        NSArray *tags = [params[TAGS] copy];
        if (tags != NULL) {
            NSSet *tagSet = [NSSet setWithArray:tags];
            NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
            [JPUSHService deleteTags:tagSet completion:^(NSInteger iResCode, NSSet *iTags, NSInteger seq) {
                NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),TAGS:[iTags allObjects]};
                [self sendTagAliasEvent:data];
            } seq:sequence];
        }
    }
}

RCT_EXPORT_METHOD(cleanTags:(NSDictionary *)params)
{
    NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
    [JPUSHService cleanTags:^(NSInteger iResCode, NSSet *iTags, NSInteger seq) {
        NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq)};
        [self sendTagAliasEvent:data];
    } seq:sequence];
}

RCT_EXPORT_METHOD(getAllTags:(NSDictionary *)params)
{
    NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
    [JPUSHService getAllTags:^(NSInteger iResCode, NSSet *iTags, NSInteger seq) {
        NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),TAGS:[iTags allObjects]};
        [self sendTagAliasEvent:data];
    } seq:sequence];
}

RCT_EXPORT_METHOD(validTag:(NSDictionary *)params)
{
    if(params[TAG]){
        NSString *tag = params[TAG];
        NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
        [JPUSHService validTag:(tag)
                    completion:^(NSInteger iResCode, NSSet *iTags, NSInteger seq, BOOL isBind) {
            NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),TAG_ENABLE:@(isBind),TAG:tag};
            [self sendTagAliasEvent:data];
        } seq:sequence];
    }
}

//alias
RCT_EXPORT_METHOD(setAlias:(NSDictionary *)params) {
    if(params[ALIAS]){
        NSString *alias = params[ALIAS];
        NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
        [JPUSHService setAlias:alias
                    completion:^(NSInteger iResCode, NSString *iAlias, NSInteger seq) {
            NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),ALIAS:iAlias};
            [self sendTagAliasEvent:data];
        }
                           seq:sequence];
    }
}

RCT_EXPORT_METHOD(deleteAlias:(NSDictionary *)params) {
    NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
    [JPUSHService deleteAlias:^(NSInteger iResCode, NSString *iAlias, NSInteger seq) {
        NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq)};
        [self sendTagAliasEvent:data];
    } seq:sequence];
}

RCT_EXPORT_METHOD(getAlias:(NSDictionary *)params) {
    NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
    [JPUSHService getAlias:^(NSInteger iResCode, NSString *iAlias, NSInteger seq) {
        NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),ALIAS:iAlias};
        [self sendTagAliasEvent:data];
    } seq:sequence];
}

//properties
RCT_EXPORT_METHOD(setProperties:(NSDictionary *)params) {
     if(params[PROS]){
         NSDictionary *properties = params[PROS];
        NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
         [JPUSHService setProperties:properties completion:^(NSInteger iResCode, NSDictionary *properties, NSInteger seq) {
             NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),PROS:properties};
             [self sendPropertiesEvent:data];
         } seq:sequence];
     }
}

RCT_EXPORT_METHOD(deleteProperties:(NSDictionary *)params) {
    if(params[PROS]){
        NSDictionary *properties = params[PROS];
        NSSet *set = [NSSet setWithArray:properties.allKeys];
        NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
        [JPUSHService deleteProperties:set completion:^(NSInteger iResCode, NSDictionary *properties, NSInteger seq) {
            NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq), PROS:properties};
            [self sendTagAliasEvent:data];
        } seq:sequence];
    }
}

RCT_EXPORT_METHOD(cleanProperties:(NSDictionary *)params) {
    NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
    [JPUSHService cleanProperties:^(NSInteger iResCode, NSDictionary *properties, NSInteger seq) {
        NSDictionary *data = @{CODE:@(iResCode),SEQUENCE:@(seq),PROS:properties};
        [self sendTagAliasEvent:data];
    } seq:sequence];
}

// 应用内消息
RCT_EXPORT_METHOD(pageEnterTo:(NSString *)pageName)
{
    [JPUSHService pageEnterTo:pageName];
}

RCT_EXPORT_METHOD(pageLeave:(NSString *)pageName)
{
    [JPUSHService pageLeave:pageName];
}

//应用内消息 代理
- (void)jPushInAppMessageDidShow:(JPushInAppMessage *)inAppMessage {
    NSDictionary *responseData = [self convertInappMsg:inAppMessage isShow:YES];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[INAPP_MESSAGE_EVENT,responseData ]
                    completion:NULL];
    
}

- (void)jPushInAppMessageDidClick:(JPushInAppMessage *)inAppMessage {
    NSDictionary *responseData = [self convertInappMsg:inAppMessage isShow:NO];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[INAPP_MESSAGE_EVENT,responseData ]
                    completion:NULL];
}

//badge 角标
RCT_EXPORT_METHOD(setBadge:(NSDictionary *)params)
{
    if(params[BADGE]){
        NSNumber *number = params[BADGE];
        if(number < 0) return;
        [JPUSHService setBadge:[number integerValue]];
    }
    if (params[APP_BADGE]) {
        NSNumber *number = params[APP_BADGE];
        if(number < 0) return;
        dispatch_async(dispatch_get_main_queue(), ^{
            [UIApplication sharedApplication].applicationIconBadgeNumber = [number integerValue];
        });
    }
}

//Properties
- (void)sendPropertiesEvent:(NSDictionary *)data
{
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[PROPERTIES_EVENT, data]
                    completion:NULL];
}

//设置手机号码
RCT_EXPORT_METHOD(setMobileNumber:(NSDictionary *)params)
{
    if(params[MOBILE_NUMBER]){
        NSString *number = params[MOBILE_NUMBER];
        NSInteger sequence = params[SEQUENCE]?[params[SEQUENCE] integerValue]:-1;
        [JPUSHService setMobileNumber:number completion:^(NSError *error) {
            NSDictionary *data = @{CODE:@(error.code),SEQUENCE:@(sequence)};
            [self sendMobileNumberEvent:data];
        }];
    }
}

//崩溃日志统计
RCT_EXPORT_METHOD(crashLogON:(NSDictionary *)params)
{
    [JPUSHService crashLogON];
}

//本地通知
RCT_EXPORT_METHOD(addNotification:(NSDictionary *)params)
{
    NSString *messageID = params[MESSAGE_ID]?params[MESSAGE_ID]:@"";
    JPushNotificationContent *content = [[JPushNotificationContent alloc] init];
    NSString *notificationTitle = params[TITLE]?params[TITLE]:@"";
    NSString *notificationContent = params[CONTENT]?params[CONTENT]:@"";
    content.title = notificationTitle;
    content.body = notificationContent;
    if (@available(iOS 15.0, *)) {
        content.interruptionLevel = 1;
    } else {
        // Fallback on earlier versions
    }
    if(params[EXTRAS]){
        content.userInfo = @{MESSAGE_ID:messageID,TITLE:notificationTitle,CONTENT:notificationContent,EXTRAS:params[EXTRAS]};
    }else{
        content.userInfo = @{MESSAGE_ID:messageID,TITLE:notificationTitle,CONTENT:notificationContent};
    }
    NSString *broadcastTime = params[BROADCASTTIME];
    JPushNotificationTrigger *trigger = [[JPushNotificationTrigger alloc] init];
    NSDateComponents *components = [[NSDateComponents alloc] init];
    NSDate *now = [NSDate date];
    if (broadcastTime && [broadcastTime isKindOfClass:[NSString class]]) {
        now = [NSDate dateWithTimeIntervalSince1970:[broadcastTime integerValue]/1000];
    }
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSUInteger unitFlags = NSYearCalendarUnit | NSMonthCalendarUnit | NSDayCalendarUnit | NSHourCalendarUnit | NSMinuteCalendarUnit | NSSecondCalendarUnit;
    NSDateComponents *dateComponent = [calendar components:unitFlags fromDate:now];
    components = dateComponent;
    components.second = [dateComponent second]+1;
    if (@available(iOS 10.0, *)) {
        trigger.dateComponents = components;
    } else {
        return;
    }
    JPushNotificationRequest *request = [[JPushNotificationRequest alloc] init];
    request.requestIdentifier = messageID;
    request.content = content;
    request.trigger = trigger;
    [JPUSHService addNotification:request];
}

RCT_EXPORT_METHOD(removeNotification:(NSDictionary *)params)
{
    NSString *requestIdentifier = params[MESSAGE_ID];
    if ([requestIdentifier isKindOfClass:[NSString class]]) {
        JPushNotificationIdentifier *identifier = [[JPushNotificationIdentifier alloc] init];
        identifier.identifiers = @[requestIdentifier];
        if (@available(iOS 10.0, *)) {
            identifier.delivered = YES;
        }
        [JPUSHService removeNotification:identifier];
    }
}

RCT_EXPORT_METHOD(clearLocalNotifications)
{
    [JPUSHService removeNotification:nil];
}

//地理围栏
RCT_EXPORT_METHOD(removeGeofenceWithIdentifier:(NSDictionary *)params)
{
    if(params[GEO_FENCE_ID]){
        [JPUSHService removeGeofenceWithIdentifier:params[GEO_FENCE_ID]];
    }
}

RCT_EXPORT_METHOD(setGeofeneceMaxCount:(NSDictionary *)params)
{
    if(params[GEO_FENCE_MAX_NUMBER]){
        [JPUSHService setGeofeneceMaxCount:[params[GEO_FENCE_MAX_NUMBER] integerValue]];
    }
}

//事件处理
- (NSArray<NSString *> *)supportedEvents
{
    return @[CONNECT_EVENT,NOTIFICATION_EVENT,CUSTOM_MESSAGE_EVENT,LOCAL_NOTIFICATION_EVENT,TAG_ALIAS_EVENT,MOBILE_NUMBER_EVENT,INAPP_MESSAGE_EVENT];
}

//长连接登录
- (void)sendConnectEvent:(NSNotification *)data {
    NSDictionary *responseData = [self convertConnect:data];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[CONNECT_EVENT,responseData]
                    completion:NULL];
}

//APNS通知消息
- (void)sendApnsNotificationEvent:(NSNotification *)data
{
    NSDictionary *responseData = [self convertApnsMessage:data];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[NOTIFICATION_EVENT, responseData]
                    completion:NULL];
    if([RCTJPushEventQueue sharedInstance]._notificationQueue.count){
        [[RCTJPushEventQueue sharedInstance]._notificationQueue removeAllObjects];
    }
}

- (void)sendApnsNotificationEventByDictionary:(NSDictionary *)data
{
    NSDictionary *responseData = [self convertApnsMessage:data];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[NOTIFICATION_EVENT, responseData]
                    completion:NULL];
    if([RCTJPushEventQueue sharedInstance]._notificationQueue.count){
        [[RCTJPushEventQueue sharedInstance]._notificationQueue removeAllObjects];
    }
}

- (void)sendLocalNotificationEventByDictionary:(NSDictionary *)data
{
    NSDictionary *responseData = [self convertLocalMessage:data];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[LOCAL_NOTIFICATION_EVENT, responseData]
                    completion:NULL];
    if([RCTJPushEventQueue sharedInstance]._localNotificationQueue.count){
        [[RCTJPushEventQueue sharedInstance]._localNotificationQueue removeAllObjects];
    }
}

//自定义消息
- (void)sendCustomNotificationEvent:(NSNotification *)data
{
    NSDictionary *responseData = [self convertCustomMessage:data];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[CUSTOM_MESSAGE_EVENT,responseData ]
                    completion:NULL];
}

//本地通知
- (void)sendLocalNotificationEvent:(NSNotification *)data
{
    NSDictionary *responseData = [self convertLocalMessage:data];
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[LOCAL_NOTIFICATION_EVENT, responseData]
                    completion:NULL];
}

//TagAlias
- (void)sendTagAliasEvent:(NSDictionary *)data
{
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[TAG_ALIAS_EVENT, data]
                    completion:NULL];
}

//电话号码
- (void)sendMobileNumberEvent:(NSDictionary *)data
{
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:@[MOBILE_NUMBER_EVENT, data]
                    completion:NULL];
}

//工具类
-(NSDictionary *)convertConnect:(NSNotification *)data {
    NSNotificationName notificationName = data.name;
    BOOL isConnect = false;
    if([notificationName isEqualToString:kJPFNetworkDidLoginNotification]){
        isConnect = true;
    }
    NSDictionary *responseData = @{CONNECT_ENABLE:@(isConnect)};
    return responseData;
}

-(NSDictionary *)convertApnsMessage:(id)data
{
    NSNotificationName notificationName;
    NSDictionary *objectData;
    if([data isKindOfClass:[NSNotification class]]){
        notificationName = [(NSNotification *)data name];
        objectData = [(NSNotification *)data object];
    }else if([data isKindOfClass:[NSDictionary class]]){
        notificationName = J_APNS_NOTIFICATION_OPENED_EVENT;
        objectData = data;
    }
    NSString *notificationEventType = ([notificationName isEqualToString:J_APNS_NOTIFICATION_OPENED_EVENT])?NOTIFICATION_OPENED:NOTIFICATION_ARRIVED;
    id alertData =  objectData[@"aps"][@"alert"];
    NSString *badge = objectData[@"aps"][@"badge"]?[objectData[@"aps"][@"badge"] stringValue]:@"";
    NSString *sound = objectData[@"aps"][@"sound"]?objectData[@"aps"][@"sound"]:@"";
    
    NSString *title = @"";
    NSString *content = @"";
    if([alertData isKindOfClass:[NSString class]]){
        content = alertData;
    }else if([alertData isKindOfClass:[NSDictionary class]]){
        title = alertData[@"title"]?alertData[@"title"]:@"";
        content = alertData[@"body"]?alertData[@"body"]:@"";
    }
    NSDictionary *responseData;
    NSMutableDictionary * copyData = [[NSMutableDictionary alloc] initWithDictionary:objectData];
    if (copyData[@"_j_business"]) {
        [copyData removeObjectForKey:@"_j_business"];
    }
    if (copyData[@"_j_uid"]) {
        [copyData removeObjectForKey:@"_j_uid"];
    }
    [copyData removeObjectForKey:@"_j_msgid"];
    if (copyData[@"aps"]) {
        [copyData removeObjectForKey:@"aps"];
    }
    NSMutableDictionary * extrasData = [[NSMutableDictionary alloc] init];
    
    NSArray * allkeys = [copyData allKeys];
    for (int i = 0; i < allkeys.count; i++)
    {
        NSString *key = [allkeys objectAtIndex:i];
        NSString *value = [copyData objectForKey:key];
        [extrasData setObject:value forKey:key];
    };
    NSString *messageID = objectData[@"_j_msgid"]?[objectData[@"_j_msgid"] stringValue]:@"";
    if (extrasData.count > 0) {
        responseData = @{MESSAGE_ID:messageID,TITLE:title,CONTENT:content,BADGE:badge,RING:sound,EXTRAS:extrasData,NOTIFICATION_EVENT_TYPE:notificationEventType};
    }
    else {
        responseData = @{MESSAGE_ID:messageID,TITLE:title,CONTENT:content,BADGE:badge,RING:sound,NOTIFICATION_EVENT_TYPE:notificationEventType};
    }
    return responseData;
}

-(NSDictionary *)convertLocalMessage:(id)data
{
    NSNotificationName notificationName;
    NSDictionary *objectData;
    if([data isKindOfClass:[NSNotification class]]){
        notificationName = [(NSNotification *)data name];
        objectData = [(NSNotification *)data object];
    }else if([data isKindOfClass:[NSDictionary class]]){
        notificationName = J_APNS_NOTIFICATION_OPENED_EVENT;
        objectData = data;
    }
    NSString *notificationEventType = ([notificationName isEqualToString:J_LOCAL_NOTIFICATION_OPENED_EVENT])?NOTIFICATION_OPENED:NOTIFICATION_ARRIVED;
    NSString *messageID = objectData[MESSAGE_ID]?objectData[MESSAGE_ID]:@"";
    NSString *title = objectData[TITLE]?objectData[TITLE]:@"";
    NSString *content = objectData[CONTENT]?objectData[CONTENT]:@"";
    NSDictionary *responseData = [[NSDictionary alloc] init];
    if(objectData[EXTRAS]){
        responseData = @{MESSAGE_ID:messageID,TITLE:title,CONTENT:content,EXTRAS:objectData[EXTRAS],NOTIFICATION_EVENT_TYPE:notificationEventType};
    }else{
        responseData = @{MESSAGE_ID:messageID,TITLE:title,CONTENT:content,NOTIFICATION_EVENT_TYPE:notificationEventType};
    }
    return responseData;
}

-(NSDictionary *)convertCustomMessage:(NSNotification *)data
{
    NSDictionary *objectData = data.object;
    NSDictionary *responseData;
    NSString *messageID = objectData[@"_j_msgid"]?objectData[@"_j_msgid"]:@"";
    NSString *title = objectData[@"title"]?objectData[@"title"]:@"";
    NSString *content = objectData[@"content"]?objectData[@"content"]:@"";
    if(objectData[@"extras"]){
        responseData = @{MESSAGE_ID:messageID,TITLE:title,CONTENT:content,EXTRAS:objectData[@"extras"]};
    }else{
        responseData = @{MESSAGE_ID:messageID,TITLE:title,CONTENT:content};
    }
    return responseData;
}

- (NSDictionary *)convertInappMsg:(JPushInAppMessage *)inAppMessage isShow:(BOOL)isShow{
    NSDictionary *result = @{
        @"mesageId": inAppMessage.mesageId ?: @"",    // 消息id
        @"title": inAppMessage.title ?:@"",       // 标题
        @"content": inAppMessage.content ?: @"",    // 内容
        @"target": inAppMessage.target ?: @[],      // 目标页面
        @"clickAction": inAppMessage.clickAction ?: @"", // 跳转地址
        @"extras": inAppMessage.extras ?: @{}, // 附加字段
        INAPP_MESSAGE_EVENT_TYPE: isShow ? INAPP_MESSAGE_SHOW : INAPP_MESSAGE_CLICK // 类型
    };
    return result;
}

@end
