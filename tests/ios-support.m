#import <Foundation/Foundation.h>
#import <CoreFoundation/CoreFoundation.h>
#import "../ios/RCTJPushModule/JPushBridgeSupport.h"

static void check(BOOL value, NSString *message) { if (!value) { fprintf(stderr, "%s\n", message.UTF8String); abort(); } }
static void drain(void) { for (int i=0; i<4; i++) CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.02, false); }
static BOOL valid(id params, NSString *key) {
    NSString *identifier=nil; NSData *token=nil; NSInteger seq=0;
    return [JPushBridgeSupport readParameters:params identifierKey:key identifier:&identifier token:&token sequence:&seq];
}
int main(void) { @autoreleasepool {
    check([JPushBridgeSupport isBoolean:@YES] && [JPushBridgeSupport isBoolean:@NO], @"true/false");
    check(![JPushBridgeSupport isBoolean:@1] && ![JPushBridgeSupport isBoolean:@"true"] && ![JPushBridgeSupport isBoolean:nil], @"strict bool");
    for (NSString *key in @[@"activityId", @"activityAttributes"]) {
        for (NSNumber *seq in @[@(-2147483648LL), @(2147483647LL)]) {
            check(valid(@{key:@"fixture",@"token":@"00aAFf",@"sequence":seq},key), @"hex and seq bounds");
            check(valid(@{key:@"fixture",@"token":[NSNull null],@"sequence":seq},key), @"unbind");
        }
        for (id token in @[@"",@"a",@"0z",@1,@[]]) {
            check(!valid(@{key:@"fixture",@"token":token,@"sequence":@1},key), @"bad token");
        }
        for (id seq in @[@YES,@1.5,@(2147483648LL),@(-2147483649LL),@"1"]) {
            check(!valid(@{key:@"fixture",@"token":[NSNull null],@"sequence":seq},key), @"bad sequence");
        }
        check(!valid(@{key:@" ",@"token":[NSNull null],@"sequence":@1},key), @"empty identifier");
        check(!valid(@{key:@"fixture",@"sequence":@1},key), @"missing token is not null unbinding");
    }
    NSString *identifier=nil; NSData *token=nil; NSInteger sequence=0;
    check([JPushBridgeSupport readParameters:@{@"activityId":@"fixture",@"token":@"00aAFf",@"sequence":@(-3)}
        identifierKey:@"activityId" identifier:&identifier token:&token sequence:&sequence], @"decode");
    check([[JPushBridgeSupport hexToken:token] isEqualToString:@"00aaff"] && sequence == -3, @"round trip without printing token");
    check([JPushBridgeSupport hexToken:nil] == nil, @"nullable callback token");
    JPushPromiseRegistry *registry=[JPushPromiseRegistry new]; NSMutableArray *events=[NSMutableArray array];
    JPushRejectBlock reject=^(NSString *code,NSString *message,NSError *error){[events addObject:code];};
    NSString *one=[registry registerResolve:^(id value){[events addObject:value];} reject:reject];
    NSString *two=[registry registerResolve:^(id value){[events addObject:value];} reject:reject];
    [registry resolve:two value:@2];[registry resolve:one value:@1];[registry resolve:one value:@3];[registry reject:one code:@"late" message:@"late"];drain();
    check([events isEqualToArray:@[@2,@1]], @"out of order and exactly once");
    NSString *old=[registry registerResolve:^(id value){[events addObject:value];} reject:reject];
    [registry resolve:old value:@4];[registry invalidate];[registry resolve:old value:@5];drain();
    check(events.count == 2 && ![registry isPending:old], @"invalidate blocks queued/late callbacks");
    check([registry registerResolve:^(id value){} reject:reject] == nil, @"closed registry");
    check([events.lastObject isEqual:@"BRIDGE_INVALIDATED"], @"closed error");
    JPushPromiseRegistry *concurrent=[JPushPromiseRegistry new]; __block int settled=0;
    NSString *pending=[concurrent registerResolve:^(id value){settled++;} reject:^(NSString *code,NSString *message,NSError *error){settled++;}];
    dispatch_group_t group=dispatch_group_create();
    dispatch_group_async(group,dispatch_get_global_queue(QOS_CLASS_DEFAULT,0),^{[concurrent resolve:pending value:@1];});
    dispatch_group_async(group,dispatch_get_global_queue(QOS_CLASS_DEFAULT,0),^{[concurrent reject:pending code:@"fixture" message:@"fixture"];});
    dispatch_group_wait(group,DISPATCH_TIME_FOREVER);drain();check(settled==1, @"simultaneous callbacks");
    puts("PASS: strict parameters, token round-trip/unbind, sequence boundaries, independent/duplicate/concurrent replies and invalidation");
} return 0; }
