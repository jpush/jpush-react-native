package cn.jpush.reactnativejpush;

import android.app.ActivityManager;
import android.app.Notification;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;

import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.CustomPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;

public class JPushModule extends ReactContextBaseJavaModule {

    private static String TAG = "JPushModule";
    private static int NOTIFICATION_BUILDER_ID = 0;
    private Context mContext;
    private static ReactApplicationContext mRAC;
    private static CountDownLatch mLatch;

    public JPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mLatch = new CountDownLatch(1);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @Override
    public String getName() {
        return "JPushModule";
    }

    @Override
    public void initialize() {
        super.initialize();
        mLatch.countDown();
        mRAC = getReactApplicationContext();
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
    }

    @ReactMethod
    public void initPush() {
        mContext = getCurrentActivity();
        JPushInterface.init(getReactApplicationContext());
        Logger.toast(mContext, "Init push success");
        Logger.i(TAG, "init Success!");
    }

    @ReactMethod
    public void getInfo(Callback successCallback) {
        WritableMap map = Arguments.createMap();
        String appKey = "AppKey:" + ExampleUtil.getAppKey(getReactApplicationContext());
        map.putString("myAppKey", appKey);
        String imei = "IMEI: " + ExampleUtil.getImei(getReactApplicationContext(), "");
        map.putString("myImei", imei);
        String packageName = "PackageName: " + getReactApplicationContext().getPackageName();
        map.putString("myPackageName", packageName);
        String deviceId = "DeviceId: " + ExampleUtil.getDeviceId(getReactApplicationContext());
        map.putString("myDeviceId", deviceId);
        String version = "Version: " + ExampleUtil.GetVersion(getReactApplicationContext());
        map.putString("myVersion", version);
        successCallback.invoke(map);
    }

    @ReactMethod
    public void stopPush() {
        mContext = getCurrentActivity();
        JPushInterface.stopPush(getReactApplicationContext());
        Logger.i(TAG, "Stop push");
        Logger.toast(mContext, "Stop push success");
    }

    @ReactMethod
    public void resumePush() {
        mContext = getCurrentActivity();
        JPushInterface.resumePush(getReactApplicationContext());
        Logger.i(TAG, "Resume push");
        Logger.toast(mContext, "Resume push success");
    }

    //为用户设置Tag,可以在服务端根据Tag推送消息
    @ReactMethod
    public void setTags(final ReadableArray strArray, final Callback callback) {
        mContext = getCurrentActivity();
        Logger.i(TAG, "tag: " + strArray.toString());
        if (strArray.size() > 0) {
            Set<String> tagSet = new LinkedHashSet<>();
            for (int i = 0; i < strArray.size(); i++) {
                if (!ExampleUtil.isValidTagAndAlias(strArray.getString(i))) {
                    Logger.toast(mContext, "Invalid tag !");
                    return;
                }
                tagSet.add(strArray.getString(i));
            }
            // final ProgressDialog dialog = new ProgressDialog(mContext);
            // dialog.setMessage("Loading");
            // dialog.show();
            JPushInterface.setAliasAndTags(getReactApplicationContext(), null,
                    tagSet, new TagAliasCallback() {
                        @Override
                        public void gotResult(int status, String desc, Set<String> set) {
                            // dialog.dismiss();
                            switch (status) {
                                case 0:
                                    Logger.i(TAG, "Set tag success. tag: " + strArray.toString());
                                    Logger.toast(getReactApplicationContext(), "Set tag success");
                                    callback.invoke(0);
                                    break;
                                case 6002:
                                    Logger.i(TAG, "Set tag timeout");
                                    Logger.toast(getReactApplicationContext(),
                                            "Set tag timeout, check your network");
                                    callback.invoke("Set tag timeout");
                                    break;
                                default:
                                    Logger.toast(getReactApplicationContext(),
                                            "Error code: " + status);
                                    callback.invoke("Set tag failed. Error code: " + status);
                            }
                        }
                    });
        } else {
            Logger.toast(mContext, "Empty tag ");
        }
    }

    //为用户设置别名,可以在服务端根据别名推送
    @ReactMethod
    public void setAlias(String str, final Callback callback) {
        mContext = getCurrentActivity();
        final String alias = str.trim();
        Logger.i(TAG, "alias: " + alias);
        if (!TextUtils.isEmpty(alias)) {
            JPushInterface.setAliasAndTags(getReactApplicationContext(), alias,
                    null, new TagAliasCallback() {
                        @Override
                        public void gotResult(int status, String desc, Set<String> set) {
                            switch (status) {
                                case 0:
                                    Logger.i(TAG, "Set alias success");
                                    Logger.toast(getReactApplicationContext(), "Set alias success");
                                    callback.invoke(0);
                                    break;
                                case 6002:
                                    Logger.i(TAG, "Set alias timeout");
                                    Logger.toast(getReactApplicationContext(),
                                            "set alias timeout, check your network");
                                    callback.invoke("Set alias timeout");
                                    break;
                                default:
                                    Logger.toast(getReactApplicationContext(), "Error code: " + status);
                                    callback.invoke("Set alias failed. Error code: " + status);
                            }
                        }
                    });
        } else {
            Logger.toast(mContext, "Empty alias ");
        }
    }

    /**
     * 设置通知提示方式 - 基础属性
     */
    @ReactMethod
    public void setStyleBasic() {
        mContext = getCurrentActivity();
        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(mContext);
        builder.statusBarDrawable = IdHelper.getDrawable(mContext, "ic_launcher");
        builder.notificationFlags = Notification.FLAG_AUTO_CANCEL;  //设置为点击后自动消失
        builder.notificationDefaults = Notification.DEFAULT_SOUND;  //设置为铃声（ Notification.DEFAULT_SOUND）或者震动（ Notification.DEFAULT_VIBRATE）
        JPushInterface.setPushNotificationBuilder(1, builder);
        Logger.toast(mContext, "Basic Builder - 1");
    }


    /**
     * 设置通知栏样式 - 定义通知栏Layout
     */
    @ReactMethod
    public void setStyleCustom() {
        mContext = getCurrentActivity();
        CustomPushNotificationBuilder builder = new CustomPushNotificationBuilder(mContext
                , IdHelper.getLayout(mContext, "customer_notification_layout"),
                IdHelper.getViewID(mContext, "icon"), IdHelper.getViewID(mContext, "title"),
                IdHelper.getViewID(mContext, "text"));
        builder.layoutIconDrawable = IdHelper.getDrawable(mContext, "ic_launcher");
        builder.developerArg0 = "developerArg2";
        JPushInterface.setPushNotificationBuilder(2, builder);
        Logger.toast(mContext, "Custom Builder - 2");
    }

    /**
     * Get registration id, different from JPushModule.addGetRegistrationIdListener, this
     * method has no calling limits.
     *
     * @param callback callback with registrationId
     */
    @ReactMethod
    public void getRegistrationID(Callback callback) {
        try {
            mContext = getCurrentActivity();
            String id = JPushInterface.getRegistrationID(mContext);
            callback.invoke(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Clear all notifications, suggest invoke this method while exiting app.
     */
    @ReactMethod
    public void clearAllNotifications() {
        JPushInterface.clearAllNotifications(getReactApplicationContext());
    }

    /**
     * Clear specified notification
     *
     * @param id the notification id
     */
    @ReactMethod
    public void clearNotificationById(String id) {
        try {
            mContext = getCurrentActivity();
            JPushInterface.clearNotificationById(mContext, Integer.parseInt(id));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 接收自定义消息,通知,通知点击事件等事件的广播
     * 文档链接:http://docs.jiguang.cn/client/android_api/
     */
    public static class JPushReceiver extends BroadcastReceiver {

        public JPushReceiver() {
        }

        @Override
        public void onReceive(Context context, Intent data) {
            Bundle bundle = data.getExtras();
            if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(data.getAction())) {
                String message = data.getStringExtra(JPushInterface.EXTRA_MESSAGE);
                String extras = bundle.getString(JPushInterface.EXTRA_EXTRA);
                WritableMap map = Arguments.createMap();
                map.putString("message", message);
                map.putString("extras", extras);
                Logger.i(TAG, "收到自定义消息: " + message);
                sendEvent("receivePushMsg", map, null);
            } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(data.getAction())) {
                try {
                    // 通知内容
                    String alertContent = bundle.getString(JPushInterface.EXTRA_ALERT);
                    // extra 字段的 json 字符串
                    String extras = bundle.getString(JPushInterface.EXTRA_EXTRA);
                    Logger.i(TAG, "收到推送下来的通知: " + alertContent);
                    if (!isApplicationRunning(context)) {
                        // HeadlessService 启动有问题，暂时弃用了
//                        Log.i(TAG, "应用尚未切换到前台运行过，启动 HeadlessService");
//                        Intent intent = new Intent(context, HeadlessService.class);
//                        intent.putExtra("data", bundle);
//                        context.startService(intent);
//                        HeadlessJsTaskService.acquireWakeLockNow(context);
                        // Save as local notification
                        // Start up application failed, will save notifications as local notifications.
                    }
                    WritableMap map = Arguments.createMap();
                    map.putString("alertContent", alertContent);
                    map.putString("extras", extras);
                    sendEvent("receiveNotification", map, null);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                // 这里点击通知跳转到指定的界面可以定制化一下
            } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(data.getAction())) {
                try {
                    Logger.d(TAG, "用户点击打开了通知");
                    // 通知内容
                    String alertContent = bundle.getString(JPushInterface.EXTRA_ALERT);
                    // extra 字段的 json 字符串
                    String extras = bundle.getString(JPushInterface.EXTRA_EXTRA);
                    WritableMap map = Arguments.createMap();
                    map.putString("alertContent", alertContent);
                    map.putString("extras", extras);
                    map.putString("jumpTo", "second");
                    // judge if application is running in background, opening initial Activity.
                    // You can change here to open appointed Activity. All you need to do is create
                    // the appointed Activity, and use JS render the appointed Activity.
                    // Please reference examples' SecondActivity for detail,
                    // and JS files are in folder: example/react-native-android
                    Intent intent = new Intent();
                    intent.setClassName(context.getPackageName(), context.getPackageName() + ".MainActivity");
                    intent.putExtras(bundle);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    context.startActivity(intent);
                    // 如果需要跳转到指定的界面，那么需要同时启动 MainActivity 及指定界面：
                    // If you need to open appointed Activity, you need to start MainActivity and
                    // appointed Activity at the same time.
//                    Intent detailIntent = new Intent();
//                    detailIntent.setClassName(context.getPackageName(), context.getPackageName() + ".SecondActivity");
//                    detailIntent.putExtras(bundle);
//                    Intent[] intents = {intent, detailIntent};
                    // 同时启动 MainActivity 以及 SecondActivity
//                    context.startActivities(intents);
                    sendEvent("openNotification", map, null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Logger.i(TAG, "Shouldn't access here");
                }
                // 应用注册完成后会发送广播，在 JS 中 JPushModule.addGetRegistrationIdListener 接口可以第一时间得到 registrationId
                // After JPush finished registering, will send this broadcast, use JPushModule.addGetRegistrationIdListener
                // to get registrationId in the first instance.
            } else if (JPushInterface.ACTION_REGISTRATION_ID.equals(data.getAction())) {
                String registrationId = data.getExtras().getString(JPushInterface.EXTRA_REGISTRATION_ID);
                Logger.d(TAG, "注册成功, registrationId: " + registrationId);
                try {
                    sendEvent("getRegistrationId", null, registrationId);
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        }

    }

    private static void sendEvent(String methodName, WritableMap map, String data) {
        try {
            mLatch.await();
            if (mRAC != null) {
                if (map != null) {
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(methodName, map);
                } else {
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(methodName, data);
                }
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static boolean isApplicationRunning(final Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> list = am.getRunningTasks(100);
        for (ActivityManager.RunningTaskInfo info : list) {
            if (info.topActivity.getPackageName().equals(context.getPackageName())) {
                return true;
            }
        }
        return false;
    }

    private static boolean isApplicationRunningBackground(final Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> tasks = am.getRunningTasks(1);
        if (!tasks.isEmpty()) {
            ComponentName topActivity = tasks.get(0).topActivity;
            if (!topActivity.getPackageName().equals(context.getPackageName())) {
                return true;
            }
        }
        return false;
    }
}
