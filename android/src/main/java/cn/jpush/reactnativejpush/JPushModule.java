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

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;


import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.CustomPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;

public class JPushModule extends ReactContextBaseJavaModule {

    private static String TAG = "JPushModule";
    private Context mContext;
    private static String mEvent;
    private static Bundle mCachedBundle;
    private static ReactApplicationContext mRAC;

    private final static String RECEIVE_NOTIFICATION = "receiveNotification";
    private final static String RECEIVE_CUSTOM_MESSAGE = "receivePushMsg";
    private final static String OPEN_NOTIFICATION = "openNotification";
    private final static String RECEIVE_REGISTRATION_ID = "getRegistrationId";

    public JPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
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

    @ReactMethod
    public void notifyJSDidLoad(Callback callback) {
        // send cached event
        if (getReactApplicationContext().hasActiveCatalystInstance()) {
            mRAC = getReactApplicationContext();
            sendEvent();
            callback.invoke(0);
        }
    }

    private static void sendEvent() {
        if (mEvent != null) {
            Logger.i(TAG, "Sending event : " + mEvent);
            switch (mEvent) {
                case RECEIVE_CUSTOM_MESSAGE:
                    WritableMap map = Arguments.createMap();
                    map.putString("message", mCachedBundle.getString(JPushInterface.EXTRA_MESSAGE));
                    map.putString("extras", mCachedBundle.getString(JPushInterface.EXTRA_EXTRA));
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(mEvent, map);
                    break;
                case RECEIVE_REGISTRATION_ID:
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(mEvent, mCachedBundle.getString(JPushInterface.EXTRA_REGISTRATION_ID));
                    break;
                case RECEIVE_NOTIFICATION:
                case OPEN_NOTIFICATION:
                    map = Arguments.createMap();
                    map.putString("alertContent", mCachedBundle.getString(JPushInterface.EXTRA_ALERT));
                    map.putString("extras", mCachedBundle.getString(JPushInterface.EXTRA_EXTRA));
                    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(mEvent, map);
                    break;
            }
            mEvent = null;
            mCachedBundle = null;
        }
    }

    /**
     * Set tags, this API is covering logic not incremental logic, means call this API will cover tags which
     * have been set. See document https://docs.jiguang.cn/jpush/client/Android/android_api/#api_3
     * for detail.
     *
     * @param strArray tags array
     * @param callback callback
     */
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
            JPushInterface.setTags(getReactApplicationContext(),
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
            Logger.toast(mContext, "Empty tag, try to cancel tags ");
            Logger.i(TAG, "Empty tag, will cancel early settings");
            JPushInterface.setTags(getReactApplicationContext(), new LinkedHashSet<String>(), new TagAliasCallback() {
                @Override
                public void gotResult(int status, String desc, Set<String> set) {
                    switch (status) {
                        case 0:
                            Logger.i(TAG, "Cancel tag success. ");
                            Logger.toast(getReactApplicationContext(), "Cancel tag success");
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
        }
    }

    /**
     * Set alias. This API is covering logic rather then incremental logic, means call this API will cover alias
     * that have been set before. See document: https://docs.jiguang.cn/jpush/client/Android/android_api/#api_3
     * for detail.
     *
     * @param str      alias string.
     * @param callback callback
     */
    @ReactMethod
    public void setAlias(String str, final Callback callback) {
        mContext = getCurrentActivity();
        final String alias = str.trim();
        Logger.i(TAG, "alias: " + alias);
        if (!TextUtils.isEmpty(alias)) {
            JPushInterface.setAlias(getReactApplicationContext(), alias,
                    new TagAliasCallback() {
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
            Logger.i(TAG, "Empty alias, will cancel early alias setting");
            JPushInterface.setAlias(getReactApplicationContext(), "", new TagAliasCallback() {
                @Override
                public void gotResult(int status, String desc, Set<String> set) {
                    switch (status) {
                        case 0:
                            Logger.i(TAG, "Cancel alias success");
                            Logger.toast(getReactApplicationContext(), "Cancel alias success");
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
        }
    }

    /**
     * Set alias and tags. This API is covering logic rather then incremental logic, means call this
     * API will override early settings. See document for detail:
     * https://docs.jiguang.cn/jpush/client/Android/android_api/#api_3
     *
     * @param alias    alias string
     * @param tagArray tags
     * @param callback callback
     */
    @ReactMethod
    public void setAliasAndTags(String alias, ReadableArray tagArray, final Callback callback) {
        if (tagArray != null) {
            Logger.i(TAG, "tag: " + tagArray.toString());
            if (tagArray.size() > 0) {
                Set<String> tagSet = new LinkedHashSet<>();
                for (int i = 0; i < tagArray.size(); i++) {
                    if (!ExampleUtil.isValidTagAndAlias(tagArray.getString(i))) {
                        Logger.toast(mContext, "Invalid tag !");
                        return;
                    }
                    tagSet.add(tagArray.getString(i));
                }
                JPushInterface.setAliasAndTags(getReactApplicationContext(), alias, tagSet, new TagAliasCallback() {
                    @Override
                    public void gotResult(int status, String desc, Set<String> set) {
                        switch (status) {
                            case 0:
                                Logger.i(TAG, "Set alias and tags success");
                                Logger.toast(getReactApplicationContext(), "Set alias and tags success");
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
                                Logger.i(TAG, "Set alias and tags failed, error code: " + status);
                                callback.invoke("Set alias and tags failed. Error code: " + status);
                        }
                    }
                });
            } else {
                Logger.i(TAG, "Calling setAliasAndTags, tags is empty, will cancel tags settings");
                JPushInterface.setAliasAndTags(getReactApplicationContext(), alias, new LinkedHashSet<String>(),
                        new TagAliasCallback() {
                            @Override
                            public void gotResult(int status, String s, Set<String> set) {
                                switch (status) {
                                    case 0:
                                        Logger.i(TAG, "Set alias and tags success");
                                        Logger.toast(getReactApplicationContext(), "Set alias and tags success");
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
                                        Logger.i(TAG, "Set alias and tags failed, error code: " + status + " error message: " + s);
                                        callback.invoke("Set alias and tags failed. Error code: " + status);
                                }
                            }
                        });
            }
        } else {
            Logger.i(TAG, "Tag array is null, will not set tag this time.");
            JPushInterface.setAliasAndTags(getReactApplicationContext(), alias, null, new TagAliasCallback() {
                @Override
                public void gotResult(int status, String s, Set<String> set) {
                    switch (status) {
                        case 0:
                            Logger.i(TAG, "Set alias and tags success");
                            Logger.toast(getReactApplicationContext(), "Set alias and tags success");
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
                            Logger.i(TAG, "Set alias and tags failed, error code: " + status + " error message: " + s);
                            callback.invoke("Set alias and tags failed. Error code: " + status);
                    }
                }
            });
        }
    }

    /**
     * 设置通知提示方式 - 基础属性
     */
    @ReactMethod
    public void setStyleBasic() {
        mContext = getCurrentActivity();
        if (mContext != null) {
            BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(mContext);
            builder.statusBarDrawable = IdHelper.getDrawable(mContext, "ic_launcher");
            builder.notificationFlags = Notification.FLAG_AUTO_CANCEL;  //设置为点击后自动消失
            builder.notificationDefaults = Notification.DEFAULT_SOUND;  //设置为铃声（ Notification.DEFAULT_SOUND）或者震动（ Notification.DEFAULT_VIBRATE）
            JPushInterface.setPushNotificationBuilder(1, builder);
            Logger.toast(mContext, "Basic Builder - 1");
        } else {
            Logger.d(TAG, "Current activity is null, discard event");
        }
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
    public void clearNotificationById(int id) {
        try {
            mContext = getCurrentActivity();
            JPushInterface.clearNotificationById(mContext, id);
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
            mCachedBundle = data.getExtras();
            if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(data.getAction())) {
                try {
                    String message = data.getStringExtra(JPushInterface.EXTRA_MESSAGE);
                    Logger.i(TAG, "收到自定义消息: " + message);
                    mEvent = RECEIVE_CUSTOM_MESSAGE;
                    if (mRAC != null) {
                        sendEvent();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(data.getAction())) {
                try {
                    // 通知内容
                    String alertContent = mCachedBundle.getString(JPushInterface.EXTRA_ALERT);
                    // extra 字段的 json 字符串
                    String extras = mCachedBundle.getString(JPushInterface.EXTRA_EXTRA);
                    Logger.i(TAG, "收到推送下来的通知: " + alertContent);
                    mEvent = RECEIVE_NOTIFICATION;
                    if (mRAC != null) {
                        sendEvent();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(data.getAction())) {
                try {
                    Logger.d(TAG, "用户点击打开了通知");
                    // 通知内容
                    String alertContent = mCachedBundle.getString(JPushInterface.EXTRA_ALERT);
                    // extra 字段的 json 字符串
                    String extras = mCachedBundle.getString(JPushInterface.EXTRA_EXTRA);
                    Intent intent;
                    if (isApplicationRunningBackground(context)) {
                        intent = new Intent();
                        intent.setClassName(context.getPackageName(), context.getPackageName() + ".MainActivity");
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    } else {
                        intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    }
                    intent.putExtras(mCachedBundle);
                    context.startActivity(intent);
                    mEvent = OPEN_NOTIFICATION;
                    if (mRAC != null) {
                        sendEvent();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    Logger.i(TAG, "Shouldn't access here");
                }
                // 应用注册完成后会发送广播，在 JS 中 JPushModule.addGetRegistrationIdListener 接口可以第一时间得到 registrationId
                // After JPush finished registering, will send this broadcast, use JPushModule.addGetRegistrationIdListener
                // to get registrationId in the first instance.
            } else if (JPushInterface.ACTION_REGISTRATION_ID.equals(data.getAction())) {
                try {
                    mEvent = RECEIVE_REGISTRATION_ID;
                    if (mRAC != null) {
                        sendEvent();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

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

    @ReactMethod
    public void jumpToPushActivity(String activityName) {
        Logger.d(TAG, "Jumping to " + activityName);
        try {
            Intent intent = new Intent();
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setClassName(mRAC, mRAC.getPackageName() + "." + activityName);
            mRAC.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @ReactMethod
    public void finishActivity() {
        try {
            Activity activity = getCurrentActivity();
            activity.finish();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
