package com.pushdemo;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

public class SecondActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected String getMainComponentName() {
        return "second";
    }

}
