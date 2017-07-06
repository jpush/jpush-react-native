package com.pushdemo;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.*;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

import java.lang.Override;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity implements DefaultHardwareBackBtnHandler {

    /**
     * rn 0.29.0 以下版本,请使用此方法,并去掉 MainApplication 文件, 0.29.0 以上版本请去掉这些注释代码
     * 注意改变其中的 JSMainModuleName 的路径(因为此版本适配了 rn 0.30.0, index.android.js 放在了项目目录下)
     * 相应地,index.android.js 中 push_activity.js,set_activity.js的引用路径也要改变(参考 index.android.js)
     */
//    private ReactRootView mReactRootView;
//    private ReactInstanceManager mReactInstanceManager;
//    private boolean SHUTDOWN_TOAST = false;
//    private boolean SHUTDOWN_LOG = false;

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        mReactRootView = new ReactRootView(this);
//        mReactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(getApplication())
//                .setBundleAssetName("index.android.bundle")
//                .setJSMainModuleName("react-native-android/index.android")
//                .addPackage(new MainReactPackage())
//                .addPackage(new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG))
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();
//        mReactRootView.startReactApplication(mReactInstanceManager, "PushDemoApp", null);
//
//        setContentView(mReactRootView);
//    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        Log.i("MainActivity", "onCreate executed!");
    }

    @Override
    protected String getMainComponentName() {
        return "PushDemoApp";
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

}
