require 'json'
pjson = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|

  s.name            = "JPushRN"
  s.version         = pjson["version"]
  s.homepage        = pjson["homepage"]
  s.summary         = pjson["description"]
  s.license         = pjson["license"]
  s.author          = pjson["author"]
  
  s.ios.deployment_target = '7.0'

  s.source          = { :git => "https://github.com/jpush/jpush-react-native.git", :tag => "#{s.version}" }
  s.source_files    = 'ios/RCTJPushModule/*.{h,m}'
  s.preserve_paths  = "*.js"
  s.frameworks      = 'UIKit','CFNetwork','CoreFoundation','CoreTelephony','SystemConfiguration','CoreGraphics','Foundation','Security'
  s.weak_frameworks = 'UserNotifications'
  s.libraries       = 'z','resolv'
  # JPush contains Swift static objects; pure Objective-C RN hosts also need compatibility libraries.
  s.user_target_xcconfig = {
    'LIBRARY_SEARCH_PATHS' => '$(inherited) "$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)" "$(SDKROOT)/usr/lib/swift"',
    'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES' => 'YES'
  }
  s.dependency 'JPush','6.3.0'
  s.dependency 'React'
end
