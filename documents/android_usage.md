## jpush-react-native Android Usage

This document is a guidance for how to use jpush-react-native in Android.

### Add JPushPackage

##### RN 0.29.0 以下版本

* 打开 app 下的 MainActivity，在 ReactInstanceManager 的 build 方法中加入 JPushPackage：

> app/MainActivity.java

![](https://github.com/KenChoi1992/SomeArticles/blob/master/screenshots/plugin3.png)

##### RN 0.29.0 以上版本

* 打开 app 下的 MainApplication.java 文件，然后加入 JPushPackage，[参考 demo](../example/android/app/src/main/java/com/pushdemo/MainApplication.java):

> app/MainApplication.java

```
import cn.jpush.reactnativejpush.JPushPackage;   // <--   导入 JPushPackage

public class MainApplication extends Application implements ReactApplication {

    // 设置为 true 将不会弹出 toast
    private boolean SHUTDOWN_TOAST = false;
    // 设置为 true 将不会打印 log
    private boolean SHUTDOWN_LOG = false;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSMainModuleName() {         // rn 0.49 后修改入口为 index
            return "index";
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)   //  <-- 添加 JPushPackage
             );
        }
    };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
```

### import JPushModule

```
import JPushModule from 'jpush-react-native';

...

// example
componentDidMount() {
    JPushModule.notifyJSDidLoad();
    JPushModule.addReceiveCustomMsgListener((message) => {
      this.setState({pushMsg: message});
    });
    JPushModule.addReceiveNotificationListener((message) => {
      console.log("receive notification: " + message);
    })
  }

  componentWillUnmount() {
    JPushModule.removeReceiveCustomMsgListener();
    JPushModule.removeReceiveNotificationListener();
  }
```
