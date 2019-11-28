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

//tagAlias
#define TAG         @"tag"
#define TAGS        @"tags"
#define TAG_ENABLE  @"tagEnable"

#define ALIAS       @"alias"

//地理围栏
#define GEO_FENCE_ID         @"geoFenceID"
#define GEO_FENCE_MAX_NUMBER @"geoFenceMaxNumber"

//通知事件类型
#define NOTIFICATION_TYPE         @"notificationType"
#define NOTIFICATION_EVENT_TYPE   @"notificationEventType"
#define NOTIFICATION_ARRIVED      @"notificationArrived"
#define NOTIFICATION_OPENED       @"notificationOpened"
#define NOTIFICATION_DISMISSED    @"notificationDismissed"
//通知消息事件
#define NOTIFICATION_EVENT        @"NotificationEvent"
//自定义消息
#define CUSTOM_MESSAGE_EVENT      @"CustomMessageEvent"
//本地通知
#define LOCAL_NOTIFICATION_EVENT  @"LocalNotificationEvent"
//连接状态
#define CONNECT_EVENT        @"ConnectEvent"
//tag alias
#define TAG_ALIAS_EVENT      @"TagAliasEvent"
//phoneNumber
#define MOBILE_NUMBER_EVENT  @"MobileNumberEvent"

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
                      selector:@selector(sendCustomNotificationEvent:)
                          name:J_CUSTOM_NOTIFICATION_EVENT
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(sendLocalNotificationEvent:)
                          name:J_LOCAL_NOTIFICATION_EVENT
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

RCT_EXPORT_METHOD(setDebugMode: (NSDictionary *)options)
{
    BOOL isDebug = false;
    if([options[@"debug"] isKindOfClass:[NSNumber class]]){
        isDebug = [options[@"debug"] boolValue];
    }
    if(isDebug){
        [JPUSHService setDebugMode];
    }
}

RCT_EXPORT_METHOD(loadJS)
{
    NSMutableArray *list = [RCTJPushEventQueue sharedInstance]._notificationQueue;
    if(list.count) {
        [self sendApnsNotificationEventByDictionary:list[0]];
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

//badge 角标
RCT_EXPORT_METHOD(setBadge:(NSDictionary *)params)
{
    if(params[BADGE]){
        NSNumber *number = params[BADGE];
        [JPUSHService setBadge:[number integerValue]];
    }
    if (params[LOCAL_BADGE]) {
        NSNumber *number = params[LOCAL_BADGE];
        [UIApplication sharedApplication].applicationIconBadgeNumber = [number integerValue];
    }
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
    BOOL validTrigger = NO;
    JPushNotificationTrigger *trigger = [[JPushNotificationTrigger alloc] init];
    if ([params[LOCAL_NOTIFICATION_TRIGGER_REPEAT] isKindOfClass:[NSNumber class]]) {
        trigger.repeat = [params[LOCAL_NOTIFICATION_TRIGGER_REPEAT] boolValue];
    }
    if (@available(iOS 10.0, *)) {
        NSDateComponents *components = [[NSDateComponents alloc] init];
        if ([params[LOCAL_NOTIFICATION_TRIGGER_YEAR] isKindOfClass:[NSNumber class]]) {
            components.year = [params[LOCAL_NOTIFICATION_TRIGGER_YEAR] integerValue];
        }
        if ([params[LOCAL_NOTIFICATION_TRIGGER_MONTH] isKindOfClass:[NSNumber class]]) {
            components.month = [params[LOCAL_NOTIFICATION_TRIGGER_MONTH] integerValue];
        }
        if ([params[LOCAL_NOTIFICATION_TRIGGER_DAY] isKindOfClass:[NSNumber class]]) {
            components.day = [params[LOCAL_NOTIFICATION_TRIGGER_DAY] integerValue];
        }
        if ([params[LOCAL_NOTIFICATION_TRIGGER_HOUR] isKindOfClass:[NSNumber class]]) {
            components.hour = [params[LOCAL_NOTIFICATION_TRIGGER_HOUR] integerValue];
        }
        if ([params[LOCAL_NOTIFICATION_TRIGGER_MINUTE] isKindOfClass:[NSNumber class]]) {
            components.minute = [params[LOCAL_NOTIFICATION_TRIGGER_MINUTE] integerValue];
        }
        if ([params[LOCAL_NOTIFICATION_TRIGGER_SECOND] isKindOfClass:[NSNumber class]]) {
            components.second = [params[LOCAL_NOTIFICATION_TRIGGER_SECOND] integerValue];
        }
        if ([params[LOCAL_NOTIFICATION_TRIGGER_YEAR] isKindOfClass:[NSNumber class]]) {
            components.year = [params[LOCAL_NOTIFICATION_TRIGGER_YEAR] integerValue];
        }
        if ([params[LOCAL_NOTIFICATION_TRIGGER_YEAR] isKindOfClass:[NSNumber class]]) {
            components.year = [params[LOCAL_NOTIFICATION_TRIGGER_YEAR] integerValue];
        }
        if ([components isValidDate]) {
            trigger.dateComponents = components;
            validTrigger = YES;
        }
        else {
            if ([params[LOCAL_NOTIFICATION_TRIGGER_TIME_SINCE_NOW] isKindOfClass:[NSNumber class]]) {
                NSInteger timeInterval = [params[LOCAL_NOTIFICATION_TRIGGER_TIME_SINCE_NOW] integerValue];
                if (timeInterval > 0) {
                    if (trigger.repeat && timeInterval < 60) {
                        NSLog(@"add notification trigger timeInterval must be more than 60s when it repeat");
                        return;
                    }
                    trigger.timeInterval = timeInterval;
                    validTrigger = YES;
                }
            }
        }
    }
    else {
        if ([params[LOCAL_NOTIFICATION_TRIGGER_TIME_SINCE_NOW] isKindOfClass:[NSNumber class]]) {
            NSInteger timeInterval = [params[LOCAL_NOTIFICATION_TRIGGER_TIME_SINCE_NOW] integerValue];
            if (timeInterval > 0) {
                NSDate *fireDate = [NSDate dateWithTimeIntervalSinceNow:timeInterval];
                trigger.fireDate = fireDate;
                validTrigger = YES;
            }
        }
    }
    if (@available(iOS 8.0, *)) {
        if ([params[LOCAL_NOTIFICATION_TRIGGER_LATITUDE] isKindOfClass:[NSNumber class]] && [params[LOCAL_NOTIFICATION_TRIGGER_LONGITUDE] isKindOfClass:[NSNumber class]]) {
            CLLocationCoordinate2D cen = CLLocationCoordinate2DMake([params[LOCAL_NOTIFICATION_TRIGGER_LATITUDE] doubleValue], [params[LOCAL_NOTIFICATION_TRIGGER_LONGITUDE] doubleValue]);
            float radius = 1000.0;
            if ([params[LOCAL_NOTIFICATION_TRIGGER_RADIUS] isKindOfClass:[NSNumber class]]) {
                radius = [params[LOCAL_NOTIFICATION_TRIGGER_RADIUS] floatValue];
            }
            NSString *triggerIdentifier = @"";
            if ([params[LOCAL_NOTIFICATION_TRIGGER_IDENTIFIER] isKindOfClass:[NSString class]]) {
                triggerIdentifier = params[LOCAL_NOTIFICATION_TRIGGER_IDENTIFIER];
            }
            CLCircularRegion *region = [[CLCircularRegion alloc] initWithCenter:cen
                                                                         radius:radius
                                                                     identifier:triggerIdentifier];
            trigger.region = region;
            validTrigger = YES;
        }
    }
    
    if (!validTrigger) {
        NSLog(@"add notification trigger error, please check trigger params");
        return;
    }
    
    JPushNotificationContent *content = [[JPushNotificationContent alloc] init];
    if ([params[LOCAL_NOTIFICATION_CONTENT_TITLE] isKindOfClass:[NSString class]]) {
        content.title = params[LOCAL_NOTIFICATION_CONTENT_TITLE];
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_SUBTITLE] isKindOfClass:[NSString class]]) {
        content.subtitle = params[LOCAL_NOTIFICATION_CONTENT_SUBTITLE];
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_BODY] isKindOfClass:[NSString class]]) {
        content.body = params[LOCAL_NOTIFICATION_CONTENT_BODY];
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_BADGE] isKindOfClass:[NSNumber class]]) {
        content.badge = params[LOCAL_NOTIFICATION_CONTENT_BADGE];
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_ACTION] isKindOfClass:[NSString class]]) {
        if (@available(iOS 8.0, *)) {
            content.action = params[LOCAL_NOTIFICATION_CONTENT_ACTION];
        }
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_CATEGORY_IDENTIFIER] isKindOfClass:[NSString class]]) {
        content.categoryIdentifier = params[LOCAL_NOTIFICATION_CONTENT_CATEGORY_IDENTIFIER];
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_THREAD_IDENTIFIER] isKindOfClass:[NSString class]]) {
        if (@available(iOS 10.0, *)) {
            content.threadIdentifier = params[LOCAL_NOTIFICATION_CONTENT_THREAD_IDENTIFIER];
        }
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_USER_INFO] isKindOfClass:[NSDictionary class]]) {
        content.userInfo = params[LOCAL_NOTIFICATION_CONTENT_USER_INFO];
    }
    if ([params[LOCAL_NOTIFICATION_CONTENT_SOUND] isKindOfClass:[NSString class]]) {
        if (@available(iOS 10.0, *)) {
            JPushNotificationSound *soundSetting = [[JPushNotificationSound alloc] init];
            soundSetting.soundName = params[LOCAL_NOTIFICATION_CONTENT_SOUND];
            content.soundSetting = soundSetting;
        }
        else {
            content.sound = params[LOCAL_NOTIFICATION_CONTENT_SOUND];
        }
    }
    if (@available(iOS 12.0, *)) {
        if ([params[LOCAL_NOTIFICATION_CONTENT_SUMMARY_ARGUMENT] isKindOfClass:[NSString class]]) {
            content.summaryArgument = params[LOCAL_NOTIFICATION_CONTENT_SUMMARY_ARGUMENT];
        }
        if ([params[LOCAL_NOTIFICATION_CONTENT_SUMMARY_ARGUMENT_COUNT] isKindOfClass:[NSNumber class]]) {
            content.summaryArgumentCount = [params[LOCAL_NOTIFICATION_CONTENT_SUMMARY_ARGUMENT_COUNT] unsignedIntegerValue];
        }
    }
    
    JPushNotificationRequest *request = [[JPushNotificationRequest alloc] init];
    if ([params[LOCAL_NOTIFICATION_REQUEST_IDENTIFIER] isKindOfClass:[NSString class]]) {
        request.requestIdentifier = params[LOCAL_NOTIFICATION_REQUEST_IDENTIFIER];
        if (@available(iOS 10.0, *)) {
            if (!request.requestIdentifier) {
                NSLog(@"add notification requestIdentifier error, please check requestIdentifier");
                return;
            }
        }
    }
    request.content = content;
    request.trigger = trigger;
    if (params[LOCAL_NOTIFICATION_REQUEST_COMPLETION]) {
        request.completionHandler = params[LOCAL_NOTIFICATION_REQUEST_COMPLETION];
    }
    [JPUSHService addNotification:request];
}

RCT_EXPORT_METHOD(removeNotification:(NSDictionary *)params)
{
    NSString *requestIdentifier = params[LOCAL_NOTIFICATION_REQUEST_IDENTIFIER];
    if ([requestIdentifier isKindOfClass:[NSString class]]) {
        JPushNotificationIdentifier *identifier = [[JPushNotificationIdentifier alloc] init];
        identifier.identifiers = @[requestIdentifier];
        if ([params[LOCAL_NOTIFICATION_IDENTIFIER_DELIVERED] isKindOfClass:[NSNumber class]]) {
            if (@available(iOS 10.0, *)) {
                identifier.delivered = [params[LOCAL_NOTIFICATION_IDENTIFIER_DELIVERED] boolValue];
            }
        }
        [JPUSHService removeNotification:identifier];
    }
    else {
        [JPUSHService removeNotification:nil];
    }
}

RCT_EXPORT_METHOD(findNotification:(NSDictionary *)params)
{
    JPushNotificationIdentifier *identifier = [[JPushNotificationIdentifier alloc] init];
    NSString *requestIdentifier = params[LOCAL_NOTIFICATION_REQUEST_IDENTIFIER];
    if ([requestIdentifier isKindOfClass:[NSString class]]) {
        identifier.identifiers = @[requestIdentifier];
    }
    else {
        identifier.identifiers = nil;
    }
    if ([params[LOCAL_NOTIFICATION_IDENTIFIER_DELIVERED] isKindOfClass:[NSNumber class]]) {
        if (@available(iOS 10.0, *)) {
            identifier.delivered = [params[LOCAL_NOTIFICATION_IDENTIFIER_DELIVERED] boolValue];
        }
    }
    if (params[LOCAL_NOTIFICATION_FIND_COMPLETION]) {
        identifier.findCompletionHandler = params[LOCAL_NOTIFICATION_FIND_COMPLETION];
    }
    [JPUSHService findNotification:identifier];
}

//地理围栏
RCT_EXPORT_METHOD(removeGeofenceWithIdentifier:(NSDictionary *)params)
{
    if(params[GEO_FENCE_ID]){
        [JPUSHService removeGeofenceWithIdentifier:params[GEO_FENCE_ID]];
    }
}

RCT_EXPORT_METHOD(setGeofenecMaxCount:(NSDictionary *)params)
{
    if(params[GEO_FENCE_MAX_NUMBER]){
        [JPUSHService setGeofenecMaxCount:[params[GEO_FENCE_MAX_NUMBER] integerValue]];
    }
}

//事件处理
- (NSArray<NSString *> *)supportedEvents
{
    return @[CONNECT_EVENT,NOTIFICATION_EVENT,CUSTOM_MESSAGE_EVENT,LOCAL_NOTIFICATION_EVENT,TAG_ALIAS_EVENT,MOBILE_NUMBER_EVENT];
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

-(NSDictionary *)convertLocalMessage:(NSNotification *)data
{
    //NSLog(@"convertConnect 结果返回：%@", data);
    NSMutableDictionary *responseData = [[NSMutableDictionary alloc] init];
    return responseData;
}

@end
