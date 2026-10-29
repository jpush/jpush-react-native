#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
typedef void (^JPushResolveBlock)(id _Nullable value);
typedef void (^JPushRejectBlock)(NSString *code, NSString *message, NSError * _Nullable error);

/** Internal per-module replies; invalidation clears blocks before any late SDK completion. */
@interface JPushPromiseRegistry : NSObject
- (nullable NSString *)registerResolve:(JPushResolveBlock)resolve reject:(JPushRejectBlock)reject;
- (BOOL)isPending:(NSString *)identifier;
- (void)resolve:(NSString *)identifier value:(nullable id)value;
- (void)reject:(NSString *)identifier code:(NSString *)code message:(NSString *)message;
- (void)invalidate;
@end

@interface JPushBridgeSupport : NSObject
+ (BOOL)isBoolean:(nullable id)value;
+ (BOOL)readParameters:(id)params identifierKey:(NSString *)key
           identifier:(NSString * _Nullable * _Nonnull)identifier
                token:(NSData * _Nullable * _Nonnull)token
             sequence:(NSInteger *)sequence;
+ (nullable NSString *)hexToken:(nullable NSData *)token;
@end
NS_ASSUME_NONNULL_END
