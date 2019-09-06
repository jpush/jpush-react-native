package cn.jiguang.plugins.push.receiver;

import android.content.Context;
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
import cn.jpush.android.api.CmdMessage;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;
import cn.jpush.android.service.JPushMessageReceiver;

public class JPushModuleReceiver extends JPushMessageReceiver {

    public void sendEvent(String eventName, WritableMap params) {
        JPushModule.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @Override
    public void onMessage(Context context, CustomMessage customMessage) {
        JPushLogger.d("onMessage:" + customMessage.toString());
        WritableMap writableMap = convertCustomMessage(customMessage);
        sendEvent(JPushConstans.CUSTOM_MESSAGE_EVENT, writableMap);
        super.onMessage(context, customMessage);
    }

    @Override
    public void onNotifyMessageArrived(Context context, NotificationMessage notificationMessage) {
        JPushLogger.d("onNotifyMessageArrived:" + notificationMessage.toString());
        WritableMap writableMap = convertNotificationToMap(JPushConstans.NOTIFICATION_ARRIVED, notificationMessage);
        sendEvent(JPushConstans.NOTIFICATION_EVENT, writableMap);
        super.onNotifyMessageArrived(context, notificationMessage);
    }

    @Override
    public void onNotifyMessageOpened(Context context, NotificationMessage notificationMessage) {
        JPushLogger.d("onNotifyMessageOpened:" + notificationMessage.toString());
        WritableMap writableMap = convertNotificationToMap(JPushConstans.NOTIFICATION_OPENED, notificationMessage);
        sendEvent(JPushConstans.NOTIFICATION_EVENT, writableMap);
        super.onNotifyMessageOpened(context, notificationMessage);
    }

    @Override
    public void onNotifyMessageDismiss(Context context, NotificationMessage notificationMessage) {
        JPushLogger.d("onNotifyMessageDismiss:" + notificationMessage.toString());
        WritableMap writableMap = convertNotificationToMap(JPushConstans.NOTIFICATION_DISMISSED, notificationMessage);
        sendEvent(JPushConstans.NOTIFICATION_EVENT, writableMap);
        super.onNotifyMessageDismiss(context, notificationMessage);
    }

    @Override
    public void onRegister(Context context, String registrationId) {
        JPushLogger.d("onRegister:" + registrationId);
        super.onRegister(context, registrationId);
    }

    @Override
    public void onConnected(Context context, boolean state) {
        JPushLogger.d("onConnected state:" + state);
        WritableMap writableMap = Arguments.createMap();
        writableMap.putBoolean(JPushConstans.CONNECT_ENABLE, state);
        sendEvent(JPushConstans.CONNECT_EVENT, writableMap);
        super.onConnected(context, state);
    }

    @Override
    public void onCommandResult(Context context, CmdMessage message) {
        JPushLogger.d("onCommandResult:" + message.toString());
        WritableMap writableMap = Arguments.createMap();
        writableMap.putInt(JPushConstans.COMMAND, message.cmd);
        writableMap.putString(JPushConstans.COMMAND_EXTRA, message.extra.toString());
        writableMap.putString(JPushConstans.COMMAND_MESSAGE, message.msg);
        writableMap.putInt(JPushConstans.COMMAND_RESULT, message.errorCode);
        sendEvent(JPushConstans.COMMAND_EVENT, writableMap);
        super.onCommandResult(context, message);
    }

    @Override
    public void onTagOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onTagOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = convertJPushMessageToMap(1, jPushMessage);
        sendEvent(JPushConstans.TAG_ALIAS_EVENT, writableMap);
        super.onTagOperatorResult(context, jPushMessage);
    }

    @Override
    public void onCheckTagOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onCheckTagOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = convertJPushMessageToMap(2, jPushMessage);
        sendEvent(JPushConstans.TAG_ALIAS_EVENT, writableMap);
        super.onCheckTagOperatorResult(context, jPushMessage);
    }

    @Override
    public void onAliasOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onAliasOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = convertJPushMessageToMap(3, jPushMessage);
        sendEvent(JPushConstans.TAG_ALIAS_EVENT, writableMap);
        super.onAliasOperatorResult(context, jPushMessage);
    }

    @Override
    public void onMobileNumberOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onMobileNumberOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = Arguments.createMap();
        writableMap.putInt(JPushConstans.CODE, jPushMessage.getErrorCode());
        writableMap.putInt(JPushConstans.SEQUENCE, jPushMessage.getSequence());
        sendEvent(JPushConstans.MOBILE_NUMBER_EVENT, writableMap);
        super.onMobileNumberOperatorResult(context, jPushMessage);
    }

    private WritableMap convertNotificationToMap(String eventType, NotificationMessage message) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JPushConstans.NOTIFICATION_EVENT_TYPE, eventType);
        writableMap.putString(JPushConstans.MESSAGE_ID, message.msgId);
        writableMap.putString(JPushConstans.TITLE, message.notificationTitle);
        writableMap.putString(JPushConstans.CONTENT, message.notificationContent);
        convertExtras(message.notificationExtras, writableMap);
        return writableMap;
    }

    private WritableMap convertCustomMessage(CustomMessage customMessage) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(JPushConstans.MESSAGE_ID, customMessage.messageId);
        writableMap.putString(JPushConstans.CONTENT, customMessage.message);
        convertExtras(customMessage.extra, writableMap);
        return writableMap;
    }

    private WritableMap convertJPushMessageToMap(int type, JPushMessage message) {
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

    private void convertExtras(String extras, WritableMap writableMap) {
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

}
