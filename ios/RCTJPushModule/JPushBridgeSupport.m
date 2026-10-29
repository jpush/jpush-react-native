#import "JPushBridgeSupport.h"
#import <CoreFoundation/CoreFoundation.h>
#import <math.h>
#import <stdint.h>

@interface JPushPromiseRegistry ()
@property(nonatomic, strong) NSMutableDictionary *replies;
@property(nonatomic) BOOL invalidated;
@end

@implementation JPushPromiseRegistry
- (instancetype)init {
    if ((self = [super init])) _replies = [NSMutableDictionary dictionary];
    return self;
}
- (NSString *)registerResolve:(JPushResolveBlock)resolve reject:(JPushRejectBlock)reject {
    @synchronized (self) {
        if (!self.invalidated) {
            NSString *identifier = [[NSUUID UUID] UUIDString];
            self.replies[identifier] = @{@"resolve": [resolve copy], @"reject": [reject copy]};
            return identifier;
        }
    }
    reject(@"BRIDGE_INVALIDATED", @"React Native bridge is invalidated", nil);
    return nil;
}
- (BOOL)isPending:(NSString *)identifier {
    @synchronized (self) { return !self.invalidated && self.replies[identifier] != nil; }
}
- (void)resolve:(NSString *)identifier value:(id)value {
    [self finish:identifier value:value code:nil message:nil];
}
- (void)reject:(NSString *)identifier code:(NSString *)code message:(NSString *)message {
    [self finish:identifier value:nil code:code message:message];
}
- (void)finish:(NSString *)identifier value:(id)value code:(NSString *)code message:(NSString *)message {
    dispatch_async(dispatch_get_main_queue(), ^{
        @synchronized (self) {
            NSDictionary *entry = self.replies[identifier];
            if (self.invalidated || entry == nil) return;
            [self.replies removeObjectForKey:identifier];
            if (code) {
                JPushRejectBlock reject = entry[@"reject"];
                reject(code, message, nil);
            } else {
                JPushResolveBlock resolve = entry[@"resolve"];
                resolve(value);
            }
        }
    });
}
- (void)invalidate {
    @synchronized (self) {
        self.invalidated = YES;
        [self.replies removeAllObjects];
    }
}
@end

@implementation JPushBridgeSupport
+ (BOOL)isBoolean:(id)value {
    return [value isKindOfClass:[NSNumber class]] && CFGetTypeID((__bridge CFTypeRef)value) == CFBooleanGetTypeID();
}
+ (BOOL)readParameters:(id)params identifierKey:(NSString *)key
           identifier:(NSString **)identifier token:(NSData **)token sequence:(NSInteger *)sequence {
    if (![params isKindOfClass:[NSDictionary class]]) return NO;
    id name = params[key], number = params[@"sequence"], value = params[@"token"];
    if (![name isKindOfClass:[NSString class]] ||
        [[name stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length] == 0 ||
        ![number isKindOfClass:[NSNumber class]] || [self isBoolean:number]) return NO;
    double seq = [number doubleValue];
    if (!isfinite(seq) || floor(seq) != seq || seq < INT32_MIN || seq > INT32_MAX) return NO;
    NSData *data = nil;
    if (value != [NSNull null]) {
        if (![value isKindOfClass:[NSString class]] || [value length] == 0 || [value length] % 2 != 0) return NO;
        NSMutableData *decoded = [NSMutableData dataWithLength:[value length] / 2];
        unsigned char *bytes = decoded.mutableBytes;
        for (NSUInteger i = 0; i < [value length]; i += 2) {
            int pair = 0;
            for (NSUInteger j = 0; j < 2; j++) {
                unichar c = [value characterAtIndex:i + j];
                int digit = c >= '0' && c <= '9' ? c - '0' : c >= 'a' && c <= 'f' ? c - 'a' + 10 : c >= 'A' && c <= 'F' ? c - 'A' + 10 : -1;
                if (digit < 0) return NO;
                pair = pair * 16 + digit;
            }
            bytes[i / 2] = (unsigned char)pair;
        }
        data = decoded;
    }
    *identifier = name; *token = data; *sequence = (NSInteger)seq;
    return YES;
}
+ (NSString *)hexToken:(NSData *)token {
    if (token == nil) return nil;
    NSMutableString *hex = [NSMutableString stringWithCapacity:token.length * 2];
    const unsigned char *bytes = token.bytes;
    for (NSUInteger i = 0; i < token.length; i++) [hex appendFormat:@"%02x", bytes[i]];
    return hex;
}
@end
