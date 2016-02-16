package com.pushdemo;

import android.content.Context;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class MyTextView extends View {

    public MyTextView(Context context) {
        super(context);
    }

    public void onReceiveNativeEvent(String message) {
        WritableMap event = Arguments.createMap();
        event.putString("message", message);
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                //事件名topChange在JavaScript端映射到onChange回调属性上
                // （这个映射关系在UIManagerModuleConstants.java文件里）。这个回调会被原生事件执行
                "topChange",
                event);
    }
}
