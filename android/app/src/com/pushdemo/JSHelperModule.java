package com.pushdemo;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

/**
 * 主要用于Native API的相关调用,并回调到JS
 */
public class JSHelperModule extends ReactContextBaseJavaModule {

    public JSHelperModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @ReactMethod
    public void initModule(Callback successCallback) {
        WritableMap map = Arguments.createMap();
        String appKey = "AppKey:" + ExampleUtil.getAppKey(PushDemoApplication.getContext());
        map.putString("myAppKey", appKey);
        String imei = "IMEI: " + ExampleUtil.getImei(PushDemoApplication.getContext(), "");
        map.putString("myImei", imei);
        String packageName = "PackageName: " + getReactApplicationContext().getPackageName();
        map.putString("myPackageName", packageName);
        String deviceId = "DeviceId: " + ExampleUtil.getDeviceId(PushDemoApplication.getContext());
        map.putString("myDeviceId", deviceId);
        String version = "Version: " + ExampleUtil.GetVersion(PushDemoApplication.getContext());
        map.putString("myVersion", version);
        successCallback.invoke(map);
    }

    @Override
    public String getName() {
        return "JSHelper";
    }
}
