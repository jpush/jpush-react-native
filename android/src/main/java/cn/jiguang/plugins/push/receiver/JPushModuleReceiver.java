package cn.jiguang.plugins.push.receiver;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import cn.jiguang.plugins.push.JPushModule;
import cn.jiguang.plugins.push.common.JLogger;
import cn.jiguang.plugins.push.common.JConstans;
import cn.jiguang.plugins.push.helper.JPushHelper;
import cn.jpush.android.api.CmdMessage;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;
import cn.jpush.android.service.JPushMessageReceiver;

public class JPushModuleReceiver extends JPushMessageReceiver {

  @Override
  public void onMessage(Context context, CustomMessage customMessage) {
    JLogger.d("onMessage:" + customMessage.toString());
    WritableMap writableMap = JPushHelper.convertCustomMessage(customMessage);
    JPushHelper.sendEvent(JConstans.CUSTOM_MESSAGE_EVENT, writableMap);
  }

  @Override
  public void onNotifyMessageArrived(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onNotifyMessageArrived:" + notificationMessage.toString());
    WritableMap writableMap = JPushHelper.convertNotificationToMap(JConstans.NOTIFICATION_ARRIVED, notificationMessage);
    JPushHelper.sendEvent(JConstans.NOTIFICATION_EVENT, writableMap);
  }

  @Override
  public void onNotifyMessageOpened(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onNotifyMessageOpened:" + notificationMessage.toString());
    if (JPushModule.reactContext != null) {
      if (!JPushModule.isAppForeground) JPushHelper.launchApp(context);
      WritableMap writableMap = JPushHelper.convertNotificationToMap(JConstans.NOTIFICATION_OPENED, notificationMessage);
      JPushHelper.sendEvent(JConstans.NOTIFICATION_EVENT, writableMap);
    } else {
      super.onNotifyMessageOpened(context, notificationMessage);
    }
  }

  @Override
  public void onNotifyMessageDismiss(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onNotifyMessageDismiss:" + notificationMessage.toString());
    WritableMap writableMap = JPushHelper.convertNotificationToMap(JConstans.NOTIFICATION_DISMISSED, notificationMessage);
    JPushHelper.sendEvent(JConstans.NOTIFICATION_EVENT, writableMap);
  }

  @Override
  public void onRegister(Context context, String registrationId) {
    JLogger.d("onRegister:" + registrationId);
  }

  @Override
  public void onConnected(Context context, boolean state) {
    JLogger.d("onConnected state:" + state);
    WritableMap writableMap = Arguments.createMap();
    writableMap.putBoolean(JConstans.CONNECT_ENABLE, state);
    JPushHelper.sendEvent(JConstans.CONNECT_EVENT, writableMap);
  }

  @Override
  public void onCommandResult(Context context, CmdMessage message) {
    JLogger.d("onCommandResult:" + message.toString());
    WritableMap writableMap = Arguments.createMap();
    writableMap.putInt(JConstans.COMMAND, message.cmd);
    writableMap.putString(JConstans.COMMAND_EXTRA, message.extra.toString());
    writableMap.putString(JConstans.COMMAND_MESSAGE, message.msg);
    writableMap.putInt(JConstans.COMMAND_RESULT, message.errorCode);
    JPushHelper.sendEvent(JConstans.COMMAND_EVENT, writableMap);
  }

  @Override
  public void onTagOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onTagOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = JPushHelper.convertJPushMessageToMap(1, jPushMessage);
    JPushHelper.sendEvent(JConstans.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onCheckTagOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onCheckTagOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = JPushHelper.convertJPushMessageToMap(2, jPushMessage);
    JPushHelper.sendEvent(JConstans.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onAliasOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onAliasOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = JPushHelper.convertJPushMessageToMap(3, jPushMessage);
    JPushHelper.sendEvent(JConstans.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onMobileNumberOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onMobileNumberOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = Arguments.createMap();
    writableMap.putInt(JConstans.CODE, jPushMessage.getErrorCode());
    writableMap.putInt(JConstans.SEQUENCE, jPushMessage.getSequence());
    JPushHelper.sendEvent(JConstans.MOBILE_NUMBER_EVENT, writableMap);
  }

}
