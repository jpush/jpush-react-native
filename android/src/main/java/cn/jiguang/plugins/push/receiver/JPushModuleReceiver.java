package cn.jiguang.plugins.push.receiver;

import android.content.Context;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import cn.jiguang.plugins.push.JPushModule;
import cn.jiguang.plugins.push.SubscriptionResultCodec;
import cn.jiguang.plugins.push.common.JLogger;
import cn.jiguang.plugins.push.common.JConstants;
import cn.jiguang.plugins.push.helper.JPushHelper;
import cn.jpush.android.api.CmdMessage;
import cn.jpush.android.api.VoipDataMessage;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;
import cn.jpush.android.service.JPushMessageReceiver;
import cn.jpush.android.api.NotificationCustomButton;

public class JPushModuleReceiver extends JPushMessageReceiver {

  @Override
  public void onVoipMessage(Context context, VoipDataMessage message) {
    if (message == null) return;
    WritableMap value = Arguments.createMap();
    value.putString("messageId", message.getMessageId());
    value.putString("extraData", message.getExtraData());
    value.putInt("platform", message.getPlatform());
    value.putInt("voipSupportStatus", message.getVoipSupportStatus());
    // Never log arbitrary VoIP content. The support status is preserved as a native integer.
    JPushHelper.sendEvent("VoipMessageEvent", value);
  }

  @Override
  public void onMessage(Context context, CustomMessage customMessage) {
    JLogger.d("onMessage:" + customMessage.toString());
    WritableMap writableMap = JPushHelper.convertCustomMessage(customMessage);
    JPushHelper.sendEvent(JConstants.CUSTOM_MESSAGE_EVENT, writableMap);
  }

  @Override
  public void onNotifyMessageArrived(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onNotifyMessageArrived:" + notificationMessage.toString());
    WritableMap writableMap = JPushHelper.convertNotificationToMap(JConstants.NOTIFICATION_ARRIVED, notificationMessage);
    if(notificationMessage.notificationType!=1){
      JPushHelper.sendEvent(JConstants.NOTIFICATION_EVENT, writableMap);
    }else {
      JPushHelper.sendEvent(JConstants.LOCAL_NOTIFICATION_EVENT, writableMap);
    }
  }
  @Override
  public void onPropertyOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onPropertyOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = JPushHelper.convertJPushMessageToMap(1, jPushMessage);
    JPushHelper.sendEvent(JConstants.TAG_ALIAS_EVENT, writableMap);
  }
  @Override
  public void onNotifyMessageOpened(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onNotifyMessageOpened:" + notificationMessage.toString());
    if (JPushModule.reactContext != null) {
      if (!JPushModule.isAppForeground) JPushHelper.launchApp(context);
      WritableMap writableMap = JPushHelper.convertNotificationToMap(JConstants.NOTIFICATION_OPENED, notificationMessage);
      JPushHelper.sendEvent(JConstants.NOTIFICATION_EVENT, writableMap);
    } else {
      super.onNotifyMessageOpened(context, notificationMessage);
    }
  }
  @Override
  public void onInAppMessageShow(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onInAppMessageShow:" + notificationMessage.toString());
    if (JPushModule.reactContext != null) {
      if (!JPushModule.isAppForeground) JPushHelper.launchApp(context);
      WritableMap writableMap = JPushHelper.convertInAppMessageToMap(JConstants.IN_APP_MESSAGE_SHOW, notificationMessage);
      JPushHelper.sendEvent(JConstants.INAPP_MESSAGE_EVENT, writableMap);
    } else {
      super.onInAppMessageShow(context, notificationMessage);
    }
  }
  @Override
  public void onInAppMessageClick(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onInAppMessageClick:" + notificationMessage.toString());
    if (JPushModule.reactContext != null) {
      if (!JPushModule.isAppForeground) JPushHelper.launchApp(context);
      WritableMap writableMap = JPushHelper.convertInAppMessageToMap(JConstants.IN_APP_MESSAGE_CLICK, notificationMessage);
      JPushHelper.sendEvent(JConstants.INAPP_MESSAGE_EVENT, writableMap);
    } else {
      super.onInAppMessageClick(context, notificationMessage);
    }
  }

  @Override
  public void onNotifyMessageDismiss(Context context, NotificationMessage notificationMessage) {
    JLogger.d("onNotifyMessageDismiss:" + notificationMessage.toString());
    WritableMap writableMap = JPushHelper.convertNotificationToMap(JConstants.NOTIFICATION_DISMISSED, notificationMessage);
    JPushHelper.sendEvent(JConstants.NOTIFICATION_EVENT, writableMap);
  }

  @Override
  public void onNotifyButtonClick(Context context, NotificationCustomButton notificationCustomButton) {
    JLogger.d("onNotifyButtonClick:" + notificationCustomButton.toString());
    WritableMap writableMap = JPushHelper.convertNotificationCustomButtonToMap(notificationCustomButton);
    JPushHelper.sendEvent(JConstants.NOTIFY_BUTTON_CLICK_EVENT, writableMap);
 }

  @Override
  public void onRegister(Context context, String registrationId) {
    JLogger.d("onRegister:" + registrationId);
  }

  @Override
  public void onConnected(Context context, boolean state) {
    JLogger.d("onConnected state:" + state);
    WritableMap writableMap = Arguments.createMap();
    writableMap.putBoolean(JConstants.CONNECT_ENABLE, state);
    JPushHelper.sendEvent(JConstants.CONNECT_EVENT, writableMap);
  }

  @Override
  public void onCommandResult(Context context, CmdMessage message) {
    if (message == null) return;
    JLogger.d("onCommandResult:" + message.toString());
    
    // 处理getPushStatus的回调结果 (cmd = 2003)
    if (message != null && message.cmd == 2003) {
      JPushModule.handleGetPushStatusResult(message.errorCode, message.msg);
    }
    
    WritableMap writableMap = Arguments.createMap();
    writableMap.putInt(JConstants.COMMAND, message.cmd);
    writableMap.putString(JConstants.COMMAND_EXTRA, message.extra != null ? message.extra.toString() : "");
    writableMap.putString(JConstants.COMMAND_MESSAGE, message.msg);
    writableMap.putInt(JConstants.COMMAND_RESULT, message.errorCode);
    if (message.cmd == JConstants.REQUEST_SUBSCRIBE_CHANNEL_COMMAND && message.extra != null) {
      writableMap.putString(
          JConstants.OPEN_CHANNEL_RESULT,
          message.extra.getString(JConstants.OPEN_CHANNEL_RESULT_EXTRA, ""));
      writableMap.putInt(
          JConstants.PLATFORM,
          message.extra.getInt(JConstants.PLATFORM_EXTRA, 0));
    }
    if (message.cmd == 2013 && message.extra != null) {
      WritableMap commandData = SubscriptionResultCodec.fromBundle(message.extra);
      writableMap.putMap("commandData", commandData);
      // Keep the SDK representation, including a JSON string when supplied as such.
      if (message.extra.containsKey("channels")) {
        Bundle channelBundle = new Bundle(message.extra);
        for (String key : message.extra.keySet()) {
          if (!"channels".equals(key)) channelBundle.remove(key);
        }
        writableMap.merge(SubscriptionResultCodec.fromBundle(channelBundle));
      }
    }
    JPushHelper.sendEvent(JConstants.COMMAND_EVENT, writableMap);
  }

  @Override
  public void onTagOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onTagOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = JPushHelper.convertJPushMessageToMap(1, jPushMessage);
    JPushHelper.sendEvent(JConstants.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onCheckTagOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onCheckTagOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = JPushHelper.convertJPushMessageToMap(2, jPushMessage);
    JPushHelper.sendEvent(JConstants.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onAliasOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onAliasOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = JPushHelper.convertJPushMessageToMap(3, jPushMessage);
    JPushHelper.sendEvent(JConstants.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onMobileNumberOperatorResult(Context context, JPushMessage jPushMessage) {
    JLogger.d("onMobileNumberOperatorResult:" + jPushMessage.toString());
    WritableMap writableMap = Arguments.createMap();
    writableMap.putInt(JConstants.CODE, jPushMessage.getErrorCode());
    writableMap.putInt(JConstants.SEQUENCE, jPushMessage.getSequence());
    JPushHelper.sendEvent(JConstants.MOBILE_NUMBER_EVENT, writableMap);
  }

}
