package com.example;

import android.os.Bundle;

import com.facebook.react.*;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

import java.lang.Override;

public class MainActivity extends ReactActivity implements DefaultHardwareBackBtnHandler {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected String getMainComponentName() {
        return "JPush-RN";
    }

}
