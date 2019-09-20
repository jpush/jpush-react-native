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
import cn.jiguang.plugins.push.common.JPushConstans;
import cn.jiguang.plugins.push.common.JPushLogger;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;

public class JPushHelper {

    public static void sendEvent(String eventName, WritableMap params) {
        try {
            JPushModule.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
        }catch (Throwable throwable){
            JPushLogger.e("sendEvent error:"+throwable.getMessage());
        }
    }

    public static WritableMap convertNotificationToMap(String eventType, NotificationMessage message) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JPushConstans.NOTIFICATION_EVENT_TYPE, eventType);
        writableMap.putString(JPushConstans.MESSAGE_ID, message.msgId);
        writableMap.putString(JPushConstans.TITLE, message.notificationTitle);
        writableMap.putString(JPushConstans.CONTENT, message.notificationContent);
        convertExtras(message.notificationExtras, writableMap);
        return writableMap;
    }

    public static WritableMap convertNotificationBundleToMap(String eventType, Bundle bundle) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JPushConstans.NOTIFICATION_EVENT_TYPE, eventType);
        writableMap.putString(JPushConstans.MESSAGE_ID, bundle.getString("cn.jpush.android.MSG_ID",""));
        writableMap.putString(JPushConstans.TITLE, bundle.getString("cn.jpush.android.NOTIFICATION_CONTENT_TITLE",""));
        writableMap.putString(JPushConstans.CONTENT, bundle.getString("cn.jpush.android.ALERT",""));
        convertExtras(bundle.getString("cn.jpush.android.EXTRA",""), writableMap);
        return writableMap;
    }


    public static WritableMap convertCustomMessage(CustomMessage customMessage) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JPushConstans.MESSAGE_ID, customMessage.messageId);
        writableMap.putString(JPushConstans.CONTENT, customMessage.message);
        convertExtras(customMessage.extra, writableMap);
        return writableMap;
    }

    public static WritableMap convertJPushMessageToMap(int type, JPushMessage message) {
        WritableMap writableMap = Arguments.createMap();
        Set<String> tags = message.getTags();
        WritableArray tagsArray = Arguments.createArray();
        for (String tag : tags) {
            tagsArray.pushString(tag);
        }
        writableMap.putInt(JPushConstans.CODE, message.getErrorCode());
        writableMap.putInt(JPushConstans.SEQUENCE, message.getSequence());
        switch (type) {
            case 1:
                writableMap.putArray(JPushConstans.TAGS, tagsArray);
                break;
            case 2:
                writableMap.putBoolean(JPushConstans.TAG_ENABLE, message.getTagCheckStateResult());
                writableMap.putString(JPushConstans.TAG, message.getCheckTag());
                break;
            case 3:
                writableMap.putString(JPushConstans.ALIAS, message.getAlias());
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
            writableMap.putMap(JPushConstans.EXTRAS, extrasMap);
        } catch (Throwable throwable) {
            JPushLogger.w("convertExtras error:" + throwable.getMessage());
        }
    }

    public static void launchApp(Context context) {
        try {
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(intent);
        }catch (Throwable throwable){
            JPushLogger.e("");
        }
    }

}
