//
//  RCTJPushEventQueue.h
//  DoubleConversion
//
//  Created by wicked on 2019/9/26.
//

#import <Foundation/Foundation.h>


@interface RCTJPushEventQueue : NSObject

+ (nonnull instancetype) sharedInstance;

@property NSMutableArray<NSDictionary *> *_notificationQueue;;

@end

