package com.pushdemo;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SecondActivity extends ReactActivity {

    private final static String KEY = "hello";
    private final static String RECEIVE_EXTRA_EVENT = "receiveExtras";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        if (null != intent) {
            String value = intent.getStringExtra("key");
            Log.i("SecondActivity", "Got intent, key: " + KEY + " value: " + value);
            WritableMap map = Arguments.createMap();
            map.putString(KEY, value);
            getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(RECEIVE_EXTRA_EVENT, map);
        }
    }

    @Override
    protected String getMainComponentName() {
        return "second";
    }

}
