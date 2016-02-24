package com.pushdemo;

import android.app.Notification;
import android.app.ProgressDialog;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.LinkedHashSet;
import java.util.Set;

import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.CustomPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;

/**
 * 主要用于Push相关API的调用(JS->Native->jpush_android_2.0.6)
 */
public class PushHelperModule extends ReactContextBaseJavaModule {

    private static String TAG = "PushHelperModule";
    private Context mContext = getReactApplicationContext();

    public PushHelperModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @ReactMethod
    public void init(Callback successCallback, Callback errorCallback) {
        try {
            JPushInterface.init(PushDemoApplication.getContext());
            successCallback.invoke("init Success!");
            Log.i("PushSDK", "init Success !");
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }

    }

    @ReactMethod
    public void stopPush(Callback successCallback, Callback errorCallback) {
        try {
            JPushInterface.stopPush(PushDemoApplication.getContext());
            Log.i("PushSDK", "stop push");
            successCallback.invoke("stop push success!");
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void resumePush(Callback successCallback, Callback errorCallback) {
        try {
            JPushInterface.resumePush(PushDemoApplication.getContext());
            Log.i("PushSDK", "resume push");
            successCallback.invoke("resume push success!");
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    //为用户设置Tag,可以在服务端根据Tag推送消息
    @ReactMethod
    public void setTag(String str) {
        final String tag = str.trim();
        Log.i(TAG, "tag: " + tag);
        if (!TextUtils.isEmpty(tag)) {
            String[] sArray = tag.split(",");
            Set<String> tagSet = new LinkedHashSet<>();
            for (String tagItem : sArray) {
                if (!ExampleUtil.isValidTagAndAlias(tagItem)) {
                    Toast.makeText(mContext, "Invalid tag !", Toast.LENGTH_SHORT).show();
                    return;
                }
                tagSet.add(tagItem);
            }
            final ProgressDialog dialog = new ProgressDialog(mContext);
            dialog.setMessage("Loading");
            dialog.show();
            JPushInterface.setAliasAndTags(PushDemoApplication.getContext(), null,
                    tagSet, new TagAliasCallback() {
                        @Override
                        public void gotResult(int status, String desc, Set<String> set) {
                            dialog.dismiss();
                            switch (status) {
                                case 0:
                                    Log.i(TAG, "Set tag success. tag: " + tag);
                                    Toast.makeText(PushDemoApplication.getContext(),
                                            "Set tag success", Toast.LENGTH_SHORT).show();
                                    break;
                                case 6002:
                                    Log.i(TAG, "Set tag timeout");
                                    Toast.makeText(PushDemoApplication.getContext(),
                                            "Set tag timeout, check your network", Toast.LENGTH_SHORT).show();
                                    break;
                                default:
                                    Toast.makeText(PushDemoApplication.getContext(),
                                            "Error code: " + status, Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
        } else {
            Toast.makeText(mContext, "Empty tag ", Toast.LENGTH_SHORT).show();
        }
    }

    //为用户设置别名,可以在服务端根据别名推送
    @ReactMethod
    public void setAlias(String str) {
        String alias = str.trim();
        Log.i(TAG, "alias: " + alias);
        if (!TextUtils.isEmpty(alias)) {
            JPushInterface.setAliasAndTags(PushDemoApplication.getContext(), alias,
                    null, new TagAliasCallback() {
                        @Override
                        public void gotResult(int status, String desc, Set<String> set) {
                            switch (status) {
                                case 0:
                                    Log.i(TAG, "Set alias success");
                                    Toast.makeText(PushDemoApplication.getContext(),
                                            "Set alias success", Toast.LENGTH_SHORT).show();
                                    break;
                                case 6002:
                                    Log.i(TAG, "Set alias timeout");
                                    Toast.makeText(PushDemoApplication.getContext(),
                                            "set alias timeout, check your network", Toast.LENGTH_SHORT).show();
                                    break;
                                default:
                                    Toast.makeText(PushDemoApplication.getContext(),
                                            "Error code: " + status, Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
        } else {
            Toast.makeText(mContext, "Empty alias ", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     *设置通知提示方式 - 基础属性
     */
    @ReactMethod
    public void setStyleBasic(){
        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(mContext);
        builder.statusBarDrawable = IdHelper.getDrawable(mContext, "ic_launcher");
        builder.notificationFlags = Notification.FLAG_AUTO_CANCEL;  //设置为点击后自动消失
        builder.notificationDefaults = Notification.DEFAULT_SOUND;  //设置为铃声（ Notification.DEFAULT_SOUND）或者震动（ Notification.DEFAULT_VIBRATE）
        JPushInterface.setPushNotificationBuilder(1, builder);
        Toast.makeText(mContext, "Basic Builder - 1", Toast.LENGTH_SHORT).show();
    }


    /**
     *设置通知栏样式 - 定义通知栏Layout
     */
    @ReactMethod
    public void setStyleCustom(){
        
        CustomPushNotificationBuilder builder = new CustomPushNotificationBuilder(mContext
                ,IdHelper.getLayout(mContext, "customer_notification_layout"),
                IdHelper.getViewID(mContext, "icon"), IdHelper.getViewID(mContext, "title"),
                IdHelper.getViewID(mContext, "text"));
        builder.layoutIconDrawable = IdHelper.getDrawable(mContext, "ic_launcher");
        builder.developerArg0 = "developerArg2";
        JPushInterface.setPushNotificationBuilder(2, builder);
        Toast.makeText(mContext,"Custom Builder - 2", Toast.LENGTH_SHORT).show();
    }

    @Override
    public String getName() {
        return "PushHelper";
    }
}
