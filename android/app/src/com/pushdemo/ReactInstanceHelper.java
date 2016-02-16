package com.pushdemo;

import android.app.Application;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.shell.MainReactPackage;

public class ReactInstanceHelper {

    private static class Holder {
        private static ReactInstanceManager sInstance = ReactInstanceManager.builder()
                .setApplication((Application) PushDemoApplication.getContext())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("android/app/react-native/index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new CustomReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
    }

    private ReactInstanceHelper() {

    }

    public static ReactInstanceManager getInstance() {
        return Holder.sInstance;
    }
}
