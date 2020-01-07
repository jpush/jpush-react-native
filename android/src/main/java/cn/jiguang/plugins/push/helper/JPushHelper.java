package cn.jiguang.plugins.push.helper;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.Iterator;
import java.util.Set;

import cn.jiguang.plugins.push.JPushModule;
import cn.jiguang.plugins.push.common.JConstants;
import cn.jiguang.plugins.push.common.JLogger;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;

public class JPushHelper {

    public static void sendEvent(String eventName, WritableMap params) {
        try {
            JPushModule.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
        }catch (Throwable throwable){
            JLogger.e("sendEvent error:"+throwable.getMessage());
        }
    }

    public static WritableMap convertNotificationToMap(String eventType, NotificationMessage message) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JConstants.NOTIFICATION_EVENT_TYPE, eventType);
        writableMap.putString(JConstants.MESSAGE_ID, message.msgId);
        writableMap.putString(JConstants.TITLE, message.notificationTitle);
        writableMap.putString(JConstants.CONTENT, message.notificationContent);
        convertExtras(message.notificationExtras, writableMap);
        return writableMap;
    }

    public static WritableMap convertNotificationBundleToMap(String eventType, Bundle bundle) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JConstants.NOTIFICATION_EVENT_TYPE, eventType);
        writableMap.putString(JConstants.MESSAGE_ID, bundle.getString("cn.jpush.android.MSG_ID",""));
        writableMap.putString(JConstants.TITLE, bundle.getString("cn.jpush.android.NOTIFICATION_CONTENT_TITLE",""));
        writableMap.putString(JConstants.CONTENT, bundle.getString("cn.jpush.android.ALERT",""));
        convertExtras(bundle.getString("cn.jpush.android.EXTRA",""), writableMap);
        return writableMap;
    }

    public static WritableMap convertCustomMessage(CustomMessage customMessage) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JConstants.MESSAGE_ID, customMessage.messageId);
        writableMap.putString(JConstants.TITLE, customMessage.title);
        writableMap.putString(JConstants.CONTENT, customMessage.message);
        writableMap.putString(JConstants.CONTENT_TYPE, customMessage.contentType);
        convertExtras(customMessage.extra, writableMap);
        return writableMap;
    }

    public static WritableMap convertJPushMessageToMap(int type, JPushMessage message) {
        WritableMap writableMap = Arguments.createMap();

        writableMap.putInt(JConstants.CODE, message.getErrorCode());
        writableMap.putInt(JConstants.SEQUENCE, message.getSequence());
        switch (type) {
            case 1:
                Set<String> tags = message.getTags();
                WritableArray tagsArray = Arguments.createArray();
                if(tags==null || tags.isEmpty()){
                    JLogger.d("tags is empty");
                }else {
                    for (String tag : tags) {
                        tagsArray.pushString(tag);
                    }
                }
                writableMap.putArray(JConstants.TAGS, tagsArray);
                break;
            case 2:
                writableMap.putBoolean(JConstants.TAG_ENABLE, message.getTagCheckStateResult());
                writableMap.putString(JConstants.TAG, message.getCheckTag());
                break;
            case 3:
                writableMap.putString(JConstants.ALIAS, message.getAlias());
                break;
        }
        return writableMap;
    }

    public static void convertExtras(String extras, WritableMap writableMap) {
        if (TextUtils.isEmpty(extras) || extras.equals("{}")) return;
        try {
            WritableMap extrasMap = Arguments.createMap();
            JSONObject jsonObject = new JSONObject(extras);
            Iterator<String> it = jsonObject.keys();
            while (it.hasNext()) {
                String key = it.next();
                String value = jsonObject.getString(key);
                extrasMap.putString(key, value);
            }
            writableMap.putMap(JConstants.EXTRAS, extrasMap);
        } catch (Throwable throwable) {
            JLogger.w("convertExtras error:" + throwable.getMessage());
        }
    }

    public static void launchApp(Context context) {
        try {
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(intent);
        }catch (Throwable throwable){
            JLogger.e("");
        }
    }

}
