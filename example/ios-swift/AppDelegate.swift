import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "HelloWord",
      in: window,
      launchOptions: launchOptions
    )
    
    //************************************************ JPush Need************************************************
    let entity = JPUSHRegisterEntity()
    entity.types = 0
    JPUSHService.register(forRemoteNotificationConfig: entity, delegate: self)

    return true
  }
  
  //************************************************ JPush Need************************************************
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // JPush 注册devicetoken
    JPUSHService.registerDeviceToken(deviceToken)
  }
  
  func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
      // 注意调用
      JPUSHService.handleRemoteNotification(userInfo)
      NotificationCenter.default.post(name: NSNotification.Name(J_APNS_NOTIFICATION_ARRIVED_EVENT), object: userInfo)
      completionHandler(.newData)
  }
  
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}


//************************************************JPush Need ************************************************

extension AppDelegate:JPUSHRegisterDelegate {
  //MARK - JPUSHRegisterDelegate
  @available(iOS 10.0, *)
  func jpushNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification,
                               withCompletionHandler completionHandler: ((Int) -> Void)) {
    let userInfo = notification.request.content.userInfo
    
    if (notification.request.trigger?.isKind(of: UNPushNotificationTrigger.self) == true) {
      // 注意调用
      JPUSHService.handleRemoteNotification(userInfo)
      NotificationCenter.default.post(name: NSNotification.Name(J_APNS_NOTIFICATION_ARRIVED_EVENT), object: userInfo)
      print("收到远程通知:\(userInfo)")
    } else {
      NotificationCenter.default.post(name: NSNotification.Name(J_LOCAL_NOTIFICATION_ARRIVED_EVENT), object: userInfo)
      print("收到本地通知:\(userInfo)")
    }
    
    completionHandler(Int(UNNotificationPresentationOptions.badge.rawValue | UNNotificationPresentationOptions.sound.rawValue | UNNotificationPresentationOptions.alert.rawValue))
  }
  
  @available(iOS 10.0, *)
  func jpushNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: (() -> Void)) {
    
    let userInfo = response.notification.request.content.userInfo
    if (response.notification.request.trigger?.isKind(of: UNPushNotificationTrigger.self) == true) {
      // 注意调用
      JPUSHService.handleRemoteNotification(userInfo)
      RCTJPushEventQueue.sharedInstance()._notificationQueue?.insert(userInfo as NSDictionary, at: 0)
      NotificationCenter.default.post(name: NSNotification.Name(J_APNS_NOTIFICATION_OPENED_EVENT), object: userInfo)
      print("点击远程通知:\(userInfo)")
      
    } else {
      print("点击本地通知:\(userInfo)")
      NotificationCenter.default.post(name: NSNotification.Name(J_LOCAL_NOTIFICATION_OPENED_EVENT), object: userInfo)
    }
    
    completionHandler()
    
  }
  
  func jpushNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification) {
    
  }
  
  func jpushNotificationAuthorization(_ status: JPAuthorizationStatus, withInfo info: [AnyHashable : Any]?) {
    print("receive notification authorization status:\(status), info:\(String(describing: info))")
  }
  
  
  // //MARK - 自定义消息
  func networkDidReceiveMessage(_ notification: NSNotification) {
    let userInfo = notification.userInfo!
    NotificationCenter.default.post(name: NSNotification.Name(J_CUSTOM_NOTIFICATION_EVENT), object: userInfo)
  }
  
  
  
}
