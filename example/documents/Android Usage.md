## jpush-react-native Android Usage

This document is a guidance for how to use jpush-react-native in Android.

### Add JPushPackage

##### RN 0.29.0 以下版本

- 打开 app 下的 MainActivity，在 ReactInstanceManager 的 build 方法中加入 JPushPackage：

> app/MainActivity.java

![](https://github.com/KenChoi1992/SomeArticles/blob/master/screenshots/plugin3.png)


##### RN 0.29.0 以上版本

- 打开 app 下的 MainApplication.java 文件，然后加入 JPushPackage，[参考 demo](https://github.com/jpush/jpush-react-native/blob/master/example/android/app/src/com/pushdemo/MainApplication.java):

> app/MainApplication.java

```
    // 设置为 true 将不弹出 toast
    private boolean SHUTDOWN_TOAST = false;
    // 设置为 true 将不打印 log
    private boolean SHUTDOWN_LOG = false;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }


        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
            );
        }
    };
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
