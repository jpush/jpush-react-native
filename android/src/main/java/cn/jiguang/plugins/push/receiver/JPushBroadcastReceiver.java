package cn.jiguang.plugins.push.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import cn.jiguang.plugins.push.common.JLogger;
import cn.jiguang.plugins.push.helper.JPushHelper;
import cn.jpush.android.api.JPushInterface;

public class JPushBroadcastReceiver extends BroadcastReceiver {

  public static Bundle NOTIFICATION_BUNDLE;

  @Override
  public void onReceive(Context context, Intent data) {
    if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(data.getAction())) {
      JLogger.d("JPushBroadcastReceiver ACTION_NOTIFICATION_OPENED");
      try {
        NOTIFICATION_BUNDLE = data.getExtras();
        JPushHelper.launchApp(context);
      } catch (Throwable throwable) {
        JLogger.e("JPushBroadcastReceiver ACTION_NOTIFICATION_OPENED error:" + throwable.getMessage());
      }
    }
  }

}
