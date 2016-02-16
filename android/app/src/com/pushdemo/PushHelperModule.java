package com.pushdemo;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import cn.jpush.android.api.JPushInterface;

/**
 * 主要用于Push相关API的调用(JS->Native->jpush_android_2.0.6)
 */
public class PushHelperModule extends ReactContextBaseJavaModule {


    public PushHelperModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @ReactMethod
    public void init() {
        Log.i("PushSDK", "init Success !");
        JPushInterface.init(PushDemoApplication.getContext());
    }

    @ReactMethod
    public void stopPush() {
        Log.i("PushSDK", "stop push");
        JPushInterface.stopPush(PushDemoApplication.getContext());
    }

    @ReactMethod
    public void resumePush() {
        Log.i("PushSDK", "resume push");
        JPushInterface.resumePush(PushDemoApplication.getContext());
    }

    @Override
    public String getName() {
        return "PushHelper";
    }
}
