package cn.jpush.reactnativejpush;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.Notification;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;
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

import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.CustomPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;
import cn.jpush.android.data.JPushLocalNotification;

public class JPushModule extends ReactContextBaseJavaModule {

    private static String TAG = "JPushModule";
    private static int NOTIFICATION_BUILDER_ID = 0;
    private Context mContext;
    private static ReactApplicationContext mRAC;
    private static JPushModule mModule;

    public JPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mRAC = reactContext;
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
        mModule = this;
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        mModule = null;
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

    @ReactMethod
    public void getRegistrationID(Callback callback) {
        mContext = getCurrentActivity();
        String id = JPushInterface.getRegistrationID(mContext);
        callback.invoke(id);
    }

    @ReactMethod
    public void clearAllNotifications() {
        JPushInterface.clearAllNotifications(getReactApplicationContext());
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
                mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("receivePushMsg", map);
            } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(data.getAction())) {
                try {
                    // 通知内容
                    String alertContent = bundle.getString(JPushInterface.EXTRA_ALERT);
                    // extra 字段的 json 字符串
                    String extras = bundle.getString(JPushInterface.EXTRA_EXTRA);
                    Logger.i(TAG, "收到推送下来的通知: " + alertContent);
                    if (!isApplicationRunning(context)) {
                        Log.i(TAG, "应用尚未切换到前台运行过，启动 HeadlessService");
                        Intent intent = new Intent(context, HeadlessService.class);
                        intent.putExtra("data", bundle);
                        context.startService(intent);
                        HeadlessJsTaskService.acquireWakeLockNow(context);
                    }
                    WritableMap map = Arguments.createMap();
                    map.putString("alertContent", alertContent);
                    map.putString("extras", extras);
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("receiveNotification", map);
                } catch (Exception e) {
                    // Start up application failed, will save notifications as local notifications.
                    Logger.i(TAG, "启动应用失败，保存为本地通知");
                    JPushLocalNotification notification = new JPushLocalNotification();
                    notification.setBuilderId(NOTIFICATION_BUILDER_ID);
                    NOTIFICATION_BUILDER_ID++;
                    notification.setNotificationId(System.currentTimeMillis());
                    notification.setContent(bundle.getString(JPushInterface.EXTRA_ALERT));
                    notification.setTitle(bundle.getString(JPushInterface.EXTRA_TITLE));
                    notification.setExtras(bundle.getString(JPushInterface.EXTRA_EXTRA));
                    notification.setBroadcastTime(System.currentTimeMillis() + 1000 * 10);
                    JPushInterface.addLocalNotification(context, notification);
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
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("openNotification", map);
                    // judge if application is running in background, opening initial Activity.
                    // You can change here to open appointed Activity. All you need to do is create
                    // the appointed Activity, and use JS render the appointed Activity.
                    // Please reference examples' SecondActivity for detail,
                    // and JS files are in folder: example/react-native-android
                    if (isApplicationRunningBackground(context)) {
                        Intent intent = new Intent();
                        intent.setClass(context, mModule.mContext.getClass());
                        Logger.d(TAG, "context.getClass: " + mModule.mContext.getClass());
                        intent.putExtras(bundle);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                                | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        context.startActivity(intent);
                        // application running in foreground, do nothing
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    Logger.i(TAG, "Try to start application");
                    if (mRAC != null) {
                        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
                        try {
                            Class clazz = classLoader.loadClass(mRAC.getPackageName() + ".MainActivity");
                            Intent intent = new Intent(context, clazz);
                            intent.putExtras(bundle);
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                            context.startActivity(intent);
                        } catch (Exception e1) {
                            e1.printStackTrace();
                            Logger.i(TAG, "Cannot find MainActivity, will discard onClick event.");
                        }

                    }
                }

            } else if (JPushInterface.ACTION_REGISTRATION_ID.equals(data.getAction())) {
                String registrationId = data.getExtras().getString(JPushInterface.EXTRA_REGISTRATION_ID);
                Logger.d(TAG, "注册成功, registrationId: " + registrationId);
                try {
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("getRegistrationId", registrationId);
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        }

    }

    private static boolean isApplicationRunning(final Context context) {
        ActivityManager am = (ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE);
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
