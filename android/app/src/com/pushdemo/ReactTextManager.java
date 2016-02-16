package com.pushdemo;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class ReactTextManager extends SimpleViewManager<MyTextView> {

    private static final String RCT_CLASS = "RCTMyTextView";

    @Override
    public String getName() {
        return RCT_CLASS;
    }

    @Override
    protected MyTextView createViewInstance(ThemedReactContext reactContext) {
        return new MyTextView(reactContext);
    }

}
