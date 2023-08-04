
package cn.jiguang.plugins.push;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.net.Uri;
import android.os.Build;
import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.lang.*;

import cn.jiguang.plugins.push.common.JConstants;
import cn.jiguang.plugins.push.common.JLogger;
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
    public void setDebugMode(boolean enable) {
        JPushInterface.setDebugMode(enable);
        JLogger.setLoggerEnable(enable);
    }

    @ReactMethod
    public void init() {
        JPushInterface.init(reactContext);
        if (JPushBroadcastReceiver.NOTIFICATION_BUNDLE != null) {
            WritableMap writableMap = JPushHelper.convertNotificationBundleToMap(JConstants.NOTIFICATION_OPENED, JPushBroadcastReceiver.NOTIFICATION_BUNDLE);
            JPushHelper.sendEvent(JConstants.NOTIFICATION_EVENT, writableMap);
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
            JLogger.w(JConstants.CALLBACK_NULL);
            return;
        }
        callback.invoke(isPushStopped);
    }

    @ReactMethod
    public void setChannel(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        String channel = readableMap.getString(JConstants.CHANNEL);
        if (TextUtils.isEmpty(channel)) {
            JLogger.w(JConstants.PARAMS_ILLEGAL);
        } else {
            JPushInterface.setChannel(reactContext, channel);
        }
    }
    @ReactMethod
    public void setChannelAndSound(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        String channel = readableMap.getString(JConstants.CHANNEL);
        String sound = readableMap.getString(JConstants.SOUND);
        String channelId = readableMap.getString(JConstants.CHANNELID);
        try {
            NotificationManager manager= (NotificationManager) reactContext.getSystemService("notification");
            if(Build.VERSION.SDK_INT<26){
                return;
            }
            if(TextUtils.isEmpty(channel)||TextUtils.isEmpty(channelId)){
                return;
            }
            NotificationChannel channel1=new NotificationChannel(channelId,channel, NotificationManager.IMPORTANCE_HIGH);
            if(!TextUtils.isEmpty(sound)){
                channel1.setSound(Uri.parse("android.resource://"+reactContext.getPackageName()+"/raw/"+sound),null);
            }
            manager.createNotificationChannel(channel1);
            JPushInterface.setChannel(reactContext,channel);
        }catch (Throwable throwable){
        }
    }
    @ReactMethod
    public void setBadgeNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.BADGE_NUMBER)) {
            int number = readableMap.getInt(JConstants.BADGE_NUMBER);
            JPushInterface.setBadgeNumber(reactContext,number);
        } else {
            JLogger.w("there are no " + JConstants.BADGE_NUMBER);
        }
    }
    @ReactMethod
    public void setPushTime(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        ReadableArray readableArray = readableMap.getArray(JConstants.PUSH_TIME_DAYS);
        int startHour = readableMap.getInt(JConstants.PUSH_TIME_START_HOUR);
        int endHour = readableMap.getInt(JConstants.PUSH_TIME_END_HOUR);
        if (readableArray == null || startHour == 0 || endHour == 0) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        Set<Integer> days = new HashSet<Integer>();
        for (int i = 0; i < readableArray.size(); i++) {
            int day = readableArray.getInt(i);
            if (day > 6 || day < 0) {
                JLogger.w(JConstants.PARAMS_NULL);
                return;
            }
            days.add(day);
        }
        JPushInterface.setPushTime(reactContext, days, startHour, endHour);
    }

    @ReactMethod
    public void setSilenceTime(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int startHour = readableMap.getInt(JConstants.SILENCE_TIME_START_HOUR);
        int startMinute = readableMap.getInt(JConstants.SILENCE_TIME_START_MINUTE);
        int endHour = readableMap.getInt(JConstants.SILENCE_TIME_END_HOUR);
        int endMinute = readableMap.getInt(JConstants.SILENCE_TIME_END_MINUTE);
        if (startHour == 0 || startMinute == 0 || endHour == 0 || endMinute == 0) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        JPushInterface.setSilenceTime(reactContext, startHour, startMinute, endHour, endMinute);
    }

    @ReactMethod
    public void getRegistrationID(Callback callback) {
        if (callback == null) {
            JLogger.w(JConstants.CALLBACK_NULL);
            return;
        }
        String registrationID = JPushInterface.getRegistrationID(reactContext);
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JConstants.REGISTRATION_ID, registrationID);
        callback.invoke(writableMap);
    }

    @ReactMethod
    public void getUdid(Callback callback) {
        if (callback == null) {
            JLogger.w(JConstants.CALLBACK_NULL);
            return;
        }
        String udid = JPushInterface.getUdid(reactContext);
        callback.invoke(udid);
    }

    @ReactMethod
    public void setLatestNotificationNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.NOTIFICATION_MAX_NUMBER)) {
            int maxNumber = readableMap.getInt(JConstants.NOTIFICATION_MAX_NUMBER);
            JPushInterface.setLatestNotificationNumber(reactContext, maxNumber);
        } else {
            JLogger.w("there are no " + JConstants.NOTIFICATION_MAX_NUMBER);
        }
    }

    @ReactMethod
    public void setDefaultPushNotificationBuilder(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(reactContext);
        JPushInterface.setDefaultPushNotificationBuilder(builder);
    }

    @ReactMethod
    public void filterValidTags(ReadableMap readableMap, Callback callback) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstants.TAGS);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.filterValidTags(tagSet);
        } else {
            JLogger.w("there are no " + JConstants.TAGS);
        }
    }
    @ReactMethod
    public void setProperties(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.PROPERTIES)) {
            int sequence = readableMap.getInt(JConstants.SEQUENCE);
            ReadableMap readMap = readableMap.getMap(JConstants.PROPERTIES);
            ReadableNativeMap map= (ReadableNativeMap) readMap;
            HashMap properties=map.toHashMap();
            JPushInterface.setProperties(reactContext,sequence,properties);
        } else {
            JLogger.w("there are no " + JConstants.PROPERTIES);
        }
    }
    @ReactMethod
    public void deleteProperties(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.PROPERTIES)) {
            int sequence = readableMap.getInt(JConstants.SEQUENCE);
            ReadableMap readMap = readableMap.getMap(JConstants.PROPERTIES);
            ReadableNativeMap map= (ReadableNativeMap) readMap;
            HashMap properties=map.toHashMap();
            JPushInterface.deleteProperties(reactContext,sequence,properties);
        } else {
            JLogger.w("there are no " + JConstants.PROPERTIES);
        }

    }
    @ReactMethod
    public void cleanProperties(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        JPushInterface.cleanProperties(reactContext,sequence);
    }
    @ReactMethod
    public void setTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstants.TAGS);
            int sequence = readableMap.getInt(JConstants.SEQUENCE);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.setTags(reactContext, sequence, tagSet);
        } else {
            JLogger.w("there are no " + JConstants.TAGS);
        }
    }

    @ReactMethod
    public void addTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstants.TAGS);
            int sequence = readableMap.getInt(JConstants.SEQUENCE);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.addTags(reactContext, sequence, tagSet);
        } else {
            JLogger.w("there are no " + JConstants.TAGS);
        }
    }

    @ReactMethod
    public void deleteTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.TAGS)) {
            ReadableArray tags = readableMap.getArray(JConstants.TAGS);
            int sequence = readableMap.getInt(JConstants.SEQUENCE);
            Set<String> tagSet = new HashSet<>();
            for (int i = 0; i < tags.size(); i++) {
                String tag = tags.getString(i);
                tagSet.add(tag);
            }
            JPushInterface.deleteTags(reactContext, sequence, tagSet);
        } else {
            JLogger.w("there are no " + JConstants.TAGS);
        }
    }

    @ReactMethod
    public void cleanTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        JPushInterface.cleanTags(reactContext, sequence);
    }

    @ReactMethod
    public void getAllTags(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        JPushInterface.getAllTags(reactContext, sequence);
    }

    @ReactMethod
    public void checkTagBindState(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        String tag = readableMap.getString(JConstants.TAG);
        JPushInterface.checkTagBindState(reactContext, sequence, tag);
    }

    @ReactMethod
    public void setAlias(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        String alias = readableMap.getString(JConstants.ALIAS);
        JPushInterface.setAlias(reactContext, sequence, alias);
    }

    @ReactMethod
    public void deleteAlias(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        JPushInterface.deleteAlias(reactContext, sequence);
    }

    @ReactMethod
    public void getAlias(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        JPushInterface.getAlias(reactContext, sequence);
    }

    @ReactMethod
    public void setMobileNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(JConstants.SEQUENCE);
        String mobileNumber = readableMap.getString(JConstants.MOBILE_NUMBER);
        JPushInterface.setMobileNumber(reactContext, sequence, mobileNumber);
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
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (!readableMap.hasKey(JConstants.MESSAGE_ID)) {
            JLogger.w(JConstants.PARAMS_ILLEGAL);
            return;
        }
        String notificationID = readableMap.getString(JConstants.MESSAGE_ID);
        if(notificationID==null || TextUtils.isEmpty(notificationID)){
            JLogger.w(JConstants.PARAMS_ILLEGAL);
            return;
        }
        int id = Integer.valueOf(notificationID);
        String notificationTitle = readableMap.hasKey(JConstants.TITLE) ? readableMap.getString(JConstants.TITLE) : reactContext.getPackageName();
        String notificationContent = readableMap.hasKey(JConstants.CONTENT) ? readableMap.getString(JConstants.CONTENT) : reactContext.getPackageName();
        String broadcastTime = readableMap.hasKey(JConstants.BROADCAST_TIME) ? readableMap.getString(JConstants.BROADCAST_TIME) : "0";
        JPushLocalNotification notification = new JPushLocalNotification();
        notification.setNotificationId(id);
        notification.setTitle(notificationTitle);
        notification.setContent(notificationContent);
        try {
            notification.setBroadcastTime(Long.parseLong(broadcastTime));
        }catch (Throwable throwable){
        }
        if (readableMap.hasKey(JConstants.EXTRAS)) {
            ReadableMap notificationExtra = readableMap.getMap(JConstants.EXTRAS);
            JSONObject notificationExtraJson = new JSONObject(notificationExtra.toHashMap());
            notification.setExtras(notificationExtraJson.toString());
        }
        JPushInterface.addLocalNotification(reactContext, notification);
    }

    @ReactMethod
    public void removeLocalNotification(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.MESSAGE_ID)) {
            String notificationID = readableMap.getString(JConstants.MESSAGE_ID);
            if(notificationID==null || TextUtils.isEmpty(notificationID)){
                JLogger.w(JConstants.PARAMS_ILLEGAL);
                return;
            }
            int id = Integer.valueOf(notificationID);
            JPushInterface.removeLocalNotification(reactContext, id);
        } else {
            JLogger.w("there are no " + JConstants.MESSAGE_ID);
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
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.GEO_FENCE_INTERVAL)) {
            int interval = readableMap.getInt(JConstants.GEO_FENCE_INTERVAL);
            JPushInterface.setGeofenceInterval(reactContext, interval);
        } else {
            JLogger.w("there are no " + JConstants.GEO_FENCE_INTERVAL);
        }
    }

    @ReactMethod
    public void setMaxGeofenceNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.GEO_FENCE_MAX_NUMBER)) {
            int maxNumber = readableMap.getInt(JConstants.GEO_FENCE_MAX_NUMBER);
            JPushInterface.setMaxGeofenceNumber(reactContext, maxNumber);
        } else {
            JLogger.w("there are no " + JConstants.GEO_FENCE_MAX_NUMBER);
        }
    }

    @ReactMethod
    public void deleteGeofence(ReadableMap readableMap) {
        if (readableMap == null) {
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.GEO_FENCE_ID)) {
            String id = readableMap.getString(JConstants.GEO_FENCE_ID);
            JPushInterface.deleteGeofence(reactContext, id);
        } else {
            JLogger.w("there are no " + JConstants.GEO_FENCE_ID);
        }
    }

    @ReactMethod
    public void clearAllNotifications(){
        JPushInterface.clearAllNotifications(reactContext);
    }

    @ReactMethod
    public void clearNotificationById(ReadableMap readableMap){
        if (readableMap == null){
            JLogger.w(JConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(JConstants.NOTIFICATION_ID)){
            Integer id = readableMap.getInt(JConstants.NOTIFICATION_ID);
            JPushInterface.clearNotificationById(reactContext,id);
        }else {
            JLogger.w("there are no " + JConstants.GEO_FENCE_ID);
        }
    }

    @ReactMethod
    public void setPowerSaveMode(boolean bool){
        JPushInterface.setPowerSaveMode(reactContext,bool);
    }

    @ReactMethod
    public void isNotificationEnabled(Callback callback){
        Integer isEnabled = JPushInterface.isNotificationEnabled(reactContext);
        if (callback == null){
            JLogger.w(JConstants.CALLBACK_NULL);
            return;
        }
        callback.invoke(isEnabled);
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
