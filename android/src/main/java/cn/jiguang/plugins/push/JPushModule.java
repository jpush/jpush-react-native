
package cn.jiguang.plugins.push;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.HashSet;
import java.util.Set;

import cn.jiguang.plugins.push.common.JLogger;
import cn.jiguang.plugins.push.common.JConstans;
import cn.jiguang.plugins.push.helper.JPushHelper;
import cn.jiguang.plugins.push.receiver.JPushBroadcastReceiver;
import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.data.JPushLocalNotification;

public class JPushModule extends ReactContextBaseJavaModule {

    public static ReactApplicationContext reactContext;

    public static boolean isAppForeground = false;

    public JPushModule(ReactApplicationContext reactApplicationContext) {
        super(reactContext);
        reactContext = reactApplicationContext;
    }

    @Override
    public String getName() {
        return "JPushModule";
    }

    @ReactMethod
    public void setDebugMode(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.getBoolean(JConstans.DEBUG)) {
            boolean enable = readableMap.getBoolean(JConstans.DEBUG);
            JPushInterface.setDebugMode(enable);
            JLogger.setLoggerEnable(enable);
        } else {
            Log.w(JLogger.TAG, JConstans.PARAMS_ILLEGAL);
        }
    }

    @ReactMethod
    public void init() {
        JPushInterface.init(reactContext);
        if (JPushBroadcastReceiver.NOTIFICATION_BUNDLE != null) {
            WritableMap writableMap = JPushHelper.convertNotificationBundleToMap(JConstans.NOTIFICATION_OPENED, JPushBroadcastReceiver.NOTIFICATION_BUNDLE);
            JPushHelper.sendEvent(JConstans.NOTIFICATION_EVENT, writableMap);
            JPushBroadcastReceiver.NOTIFICATION_BUNDLE = null;
        }
    }

    @ReactMethod
    public void stopPush() {
        JPushInterface.stopPush(reactContext);
    }

    @ReactMethod
    public void resumePush() {
        JPushInterface.resumePush(reactContext);
    }

    @ReactMethod
    public void isPushStopped(Callback callback) {
        boolean isPushStopped = JPushInterface.isPushStopped(reactContext);
        if (callback == null) {
            JLogger.w(JConstans.CALLBACK_NULL);
            return;
        }
        callback.invoke(isPushStopped);
    }

    @ReactMethod
    public void setChannel(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        String channel = readableMap.getString(JConstans.CHANNEL);
        if (TextUtils.isEmpty(channel)) {
            JLogger.w(JConstans.PARAMS_ILLEGAL);
        } else {
            JPushInterface.setChannel(reactContext, channel);
        }
    }

    @ReactMethod
    public void setPushTime(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        ReadableArray readableArray = readableMap.getArray(JConstans.PUSH_TIME_DAYS);
        int startHour = readableMap.getInt(JConstans.PUSH_TIME_START_HOUR);
        int endHour = readableMap.getInt(JConstans.PUSH_TIME_END_HOUR);
        if (readableArray == null || startHour == 0 || endHour == 0) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        Set<Integer> days = new HashSet<Integer>();
        for (int i = 0; i < readableArray.size(); i++) {
            int day = readableArray.getInt(i);
            if (day > 6 || day < 0) {
                JLogger.w(JConstans.PARAMS_NULL);
                return;
            }
            days.add(day);
        }
        JPushInterface.setPushTime(reactContext, days, startHour, endHour);
    }

    @ReactMethod
    public void setSilenceTime(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int startHour = readableMap.getInt(JConstans.SILENCE_TIME_START_HOUR);
        int startMinute = readableMap.getInt(JConstans.SILENCE_TIME_START_MINUTE);
        int endHour = readableMap.getInt(JConstans.SILENCE_TIME_END_HOUR);
        int endMinute = readableMap.getInt(JConstans.SILENCE_TIME_END_MINUTE);
        if (startHour == 0 || startMinute == 0 || endHour == 0 || endMinute == 0) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        JPushInterface.setSilenceTime(reactContext, startHour, startMinute, endHour, endMinute);
    }

    @ReactMethod
    public void getRegistrationID(Callback callback) {
        if (callback == null) {
            JLogger.w(JConstans.CALLBACK_NULL);
            return;
        }
        String registrationID = JPushInterface.getRegistrationID(reactContext);
        callback.invoke(registrationID);
    }

    @ReactMethod
    public void getUdid(Callback callback) {
        if (callback == null) {
            JLogger.w(JConstans.CALLBACK_NULL);
            return;
        }
        String udid = JPushInterface.getUdid(reactContext);
        callback.invoke(udid);
    }

    @ReactMethod
    public void setLatestNotificationNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.NOTIFICATION_MAX_NUMBER)) {
            int maxNumber = readableMap.getInt(JConstans.NOTIFICATION_MAX_NUMBER);
            JPushInterface.setLatestNotificationNumber(reactContext, maxNumber);
        } else {
            JLogger.w("there are no " + JConstans.NOTIFICATION_MAX_NUMBER);
        }
    }

    @ReactMethod
    public void clearAllNotifications() {
        JPushInterface.clearAllNotifications(reactContext);
    }

    @ReactMethod
    public void clearNotificationById(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.NOTIFICATION_ID)) {
            int notificationId = readableMap.getInt(JConstans.NOTIFICATION_ID);
            JPushInterface.clearNotificationById(reactContext, notificationId);
        } else {
            JLogger.w("there are no " + JConstans.NOTIFICATION_ID);
        }
    }

    @ReactMethod
    public void setDefaultPushNotificationBuilder(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(reactContext);
        JPushInterface.setDefaultPushNotificationBuilder(builder);
    }

    @ReactMethod
    public void setPushNotificationBuilder(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int builderId = readableMap.getInt(JConstans.NOTIFICATION_BUILDER_ID);
        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(reactContext);
        JPushInterface.setPushNotificationBuilder(builderId, builder);
    }

    @ReactMethod
    public void filterValidTags(ReadableMap readableMap, Callback callback) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstans.TAGS);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.filterValidTags(tagSet);
        } else {
            JLogger.w("there are no " + JConstans.TAGS);
        }
    }

    @ReactMethod
    public void setTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstans.TAGS);
            int sequence = readableMap.getInt(JConstans.SEQUENCE);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.setTags(reactContext, sequence, tagSet);
        } else {
            JLogger.w("there are no " + JConstans.TAGS);
        }
    }

    @ReactMethod
    public void addTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstans.TAGS);
            int sequence = readableMap.getInt(JConstans.SEQUENCE);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.addTags(reactContext, sequence, tagSet);
        } else {
            JLogger.w("there are no " + JConstans.TAGS);
        }
    }

    @ReactMethod
    public void deleteTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstans.TAGS);
            int sequence = readableMap.getInt(JConstans.SEQUENCE);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.deleteTags(reactContext, sequence, tagSet);
        } else {
            JLogger.w("there are no " + JConstans.TAGS);
        }
    }

    @ReactMethod
    public void cleanTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstans.SEQUENCE);
        JPushInterface.cleanTags(reactContext, sequence);
    }

    @ReactMethod
    public void getAllTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstans.SEQUENCE);
        JPushInterface.getAllTags(reactContext, sequence);
    }

    @ReactMethod
    public void checkTagBindState(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstans.SEQUENCE);
        String tag = readableMap.getString(JConstans.TAG);
        JPushInterface.checkTagBindState(reactContext, sequence, tag);
    }

    @ReactMethod
    public void setAlias(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstans.SEQUENCE);
        String alias = readableMap.getString(JConstans.ALIAS);
        JPushInterface.setAlias(reactContext, sequence, alias);
    }

    @ReactMethod
    public void deleteAlias(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstans.SEQUENCE);
        JPushInterface.deleteAlias(reactContext, sequence);
    }

    @ReactMethod
    public void getAlias(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstans.SEQUENCE);
        JPushInterface.getAlias(reactContext, sequence);
    }

    @ReactMethod
    public void setMobileNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstans.SEQUENCE);
        String mobileNumber = readableMap.getString(JConstans.MOBILE_NUMBER);
        JPushInterface.setMobileNumber(reactContext, sequence, mobileNumber);
    }

    @ReactMethod
    public void reportNotificationOpened(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        String messageID = readableMap.getString(JConstans.NOTIFICATION_ID);
        int romType = readableMap.getInt(JConstans.ROM_TYPE);
        if (romType > 0) {
            JPushInterface.reportNotificationOpened(reactContext, messageID, (byte) romType);
        } else {
            JPushInterface.reportNotificationOpened(reactContext, messageID);
        }
    }

    @ReactMethod
    public void onResume() {
        JPushInterface.onResume(reactContext);
    }

    @ReactMethod
    public void onPause() {
        JPushInterface.onPause(reactContext);
    }

    @ReactMethod
    public void onFragmentResume(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.FRAGMENT_NAME)) {
            String fragmentName = readableMap.getString(JConstans.FRAGMENT_NAME);
            JPushInterface.onFragmentResume(reactContext, fragmentName);
        } else {
            JLogger.w("there are no " + JConstans.FRAGMENT_NAME);
        }
    }

    @ReactMethod
    public void onFragmentPause(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.FRAGMENT_NAME)) {
            String fragmentName = readableMap.getString(JConstans.FRAGMENT_NAME);
            JPushInterface.onFragmentPause(reactContext, fragmentName);
        } else {
            JLogger.w("there are no " + JConstans.FRAGMENT_NAME);
        }
    }

    @ReactMethod
    public void onKillProcess() {
        JPushInterface.onKillProcess(reactContext);
    }

    @ReactMethod
    public void initCrashHandler() {
        JPushInterface.initCrashHandler(reactContext);
    }

    @ReactMethod
    public void stopCrashHandler() {
        JPushInterface.stopCrashHandler(reactContext);
    }

    @ReactMethod
    public void addLocalNotification(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        int notificationID = readableMap.getInt(JConstans.NOTIFICATION_ID);
        int notificationBuilderID = readableMap.getInt(JConstans.NOTIFICATION_BUILDER_ID);
        int notificationTime = readableMap.getInt(JConstans.NOTIFICATION_TIME);
        String notificationTitle = readableMap.getString(JConstans.NOTIFICATION_TITLE);
        String notificationContent = readableMap.getString(JConstans.NOTIFICATION_CONTENT);
        ReadableMap notificationExtra = readableMap.getMap(JConstans.NOTIFICATION_EXTRA);
        JSONObject notificationExtraJson = new JSONObject(notificationExtra.toHashMap());
        JPushLocalNotification notification = new JPushLocalNotification();
        notification.setBuilderId(notificationID);
        notification.setNotificationId(notificationBuilderID);
        notification.setBroadcastTime(notificationTime);
        notification.setTitle(notificationTitle);
        notification.setContent(notificationContent);
        notification.setExtras(notificationExtraJson.toString());
        JPushInterface.addLocalNotification(reactContext, notification);
    }

    @ReactMethod
    public void removeLocalNotification(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.NOTIFICATION_ID)) {
            int notificationID = readableMap.getInt(JConstans.NOTIFICATION_ID);
            JPushInterface.removeLocalNotification(reactContext, notificationID);
        } else {
            JLogger.w("there are no " + JConstans.NOTIFICATION_ID);
        }
    }

    @ReactMethod
    public void clearLocalNotifications() {
        JPushInterface.clearLocalNotifications(reactContext);
    }

    @ReactMethod
    public void requestPermission() {
        JPushInterface.requestPermission(reactContext);
    }

    @ReactMethod
    public void setGeofenceInterval(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.GEO_FENCE_INTERVAL)) {
            int interval = readableMap.getInt(JConstans.GEO_FENCE_INTERVAL);
            JPushInterface.setGeofenceInterval(reactContext, interval);
        } else {
            JLogger.w("there are no " + JConstans.GEO_FENCE_INTERVAL);
        }
    }

    @ReactMethod
    public void setMaxGeofenceNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.GEO_FENCE_MAX_NUMBER)) {
            int maxNumber = readableMap.getInt(JConstans.GEO_FENCE_MAX_NUMBER);
            JPushInterface.setMaxGeofenceNumber(reactContext, maxNumber);
        } else {
            JLogger.w("there are no " + JConstans.GEO_FENCE_MAX_NUMBER);
        }
    }

    @ReactMethod
    public void deleteGeofence(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstans.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstans.GEO_FENCE_ID)) {
            String id = readableMap.getString(JConstans.GEO_FENCE_ID);
            JPushInterface.deleteGeofence(reactContext, id);
        } else {
            JLogger.w("there are no " + JConstans.GEO_FENCE_ID);
        }
    }

    //*****************************应用前后台状态监听*****************************
    public static void registerActivityLifecycle(Application application) {
        application.registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle bundle) {
                JLogger.d("onActivityCreated");
            }

            @Override
            public void onActivityStarted(Activity activity) {
                JLogger.d("onActivityStarted");
            }

            @Override
            public void onActivityResumed(Activity activity) {
                JLogger.d("onActivityResumed");
                isAppForeground = true;
            }

            @Override
            public void onActivityPaused(Activity activity) {
                JLogger.d("onActivityPaused");
                isAppForeground = false;
            }

            @Override
            public void onActivityStopped(Activity activity) {
                JLogger.d("onActivityStopped");
            }

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
                JLogger.d("onActivitySaveInstanceState");
            }

            @Override
            public void onActivityDestroyed(Activity activity) {
                JLogger.d("onActivityDestroyed");
            }
        });
    }

}
