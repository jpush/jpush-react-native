package cn.jiguang.plugins.push.receiver;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import cn.jiguang.plugins.push.JPushModule;
import cn.jiguang.plugins.push.common.JPushConstans;
import cn.jiguang.plugins.push.common.JPushLogger;
import cn.jiguang.plugins.push.helper.JPushHelper;
import cn.jpush.android.api.CmdMessage;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;
import cn.jpush.android.service.JPushMessageReceiver;

public class JPushModuleReceiver extends JPushMessageReceiver {

    @Override
    public void onMessage(Context context, CustomMessage customMessage) {
        JPushLogger.d("onMessage:" + customMessage.toString());
        WritableMap writableMap = JPushHelper.convertCustomMessage(customMessage);
        JPushHelper.sendEvent(JPushConstans.CUSTOM_MESSAGE_EVENT, writableMap);
    }

    @Override
    public void onNotifyMessageArrived(Context context, NotificationMessage notificationMessage) {
        JPushLogger.d("onNotifyMessageArrived:" + notificationMessage.toString());
        WritableMap writableMap = JPushHelper.convertNotificationToMap(JPushConstans.NOTIFICATION_ARRIVED, notificationMessage);
        JPushHelper.sendEvent(JPushConstans.NOTIFICATION_EVENT, writableMap);
    }

    @Override
    public void onNotifyMessageOpened(Context context, NotificationMessage notificationMessage) {
        JPushLogger.d("onNotifyMessageOpened:" + notificationMessage.toString());
        if (JPushModule.reactContext != null) {
            WritableMap writableMap = JPushHelper.convertNotificationToMap(JPushConstans.NOTIFICATION_OPENED, notificationMessage);
            JPushHelper.sendEvent(JPushConstans.NOTIFICATION_EVENT, writableMap);
        } else {
            super.onNotifyMessageOpened(context, notificationMessage);
        }
    }

    @Override
    public void onNotifyMessageDismiss(Context context, NotificationMessage notificationMessage) {
        JPushLogger.d("onNotifyMessageDismiss:" + notificationMessage.toString());
        WritableMap writableMap = JPushHelper.convertNotificationToMap(JPushConstans.NOTIFICATION_DISMISSED, notificationMessage);
        JPushHelper.sendEvent(JPushConstans.NOTIFICATION_EVENT, writableMap);
    }

    @Override
    public void onRegister(Context context, String registrationId) {
        JPushLogger.d("onRegister:" + registrationId);
    }

    @Override
    public void onConnected(Context context, boolean state) {
        JPushLogger.d("onConnected state:" + state);
        WritableMap writableMap = Arguments.createMap();
        writableMap.putBoolean(JPushConstans.CONNECT_ENABLE, state);
        JPushHelper.sendEvent(JPushConstans.CONNECT_EVENT, writableMap);
    }

    @Override
    public void onCommandResult(Context context, CmdMessage message) {
        JPushLogger.d("onCommandResult:" + message.toString());
        WritableMap writableMap = Arguments.createMap();
        writableMap.putInt(JPushConstans.COMMAND, message.cmd);
        writableMap.putString(JPushConstans.COMMAND_EXTRA, message.extra.toString());
        writableMap.putString(JPushConstans.COMMAND_MESSAGE, message.msg);
        writableMap.putInt(JPushConstans.COMMAND_RESULT, message.errorCode);
        JPushHelper.sendEvent(JPushConstans.COMMAND_EVENT, writableMap);
    }

    @Override
    public void onTagOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onTagOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = JPushHelper.convertJPushMessageToMap(1, jPushMessage);
        JPushHelper.sendEvent(JPushConstans.TAG_ALIAS_EVENT, writableMap);
    }

    @Override
    public void onCheckTagOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onCheckTagOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = JPushHelper.convertJPushMessageToMap(2, jPushMessage);
        JPushHelper.sendEvent(JPushConstans.TAG_ALIAS_EVENT, writableMap);
    }

    @Override
    public void onAliasOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onAliasOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = JPushHelper.convertJPushMessageToMap(3, jPushMessage);
        JPushHelper.sendEvent(JPushConstans.TAG_ALIAS_EVENT, writableMap);
    }

    @Override
    public void onMobileNumberOperatorResult(Context context, JPushMessage jPushMessage) {
        JPushLogger.d("onMobileNumberOperatorResult:" + jPushMessage.toString());
        WritableMap writableMap = Arguments.createMap();
        writableMap.putInt(JPushConstans.CODE, jPushMessage.getErrorCode());
        writableMap.putInt(JPushConstans.SEQUENCE, jPushMessage.getSequence());
        JPushHelper.sendEvent(JPushConstans.MOBILE_NUMBER_EVENT, writableMap);
    }

}
