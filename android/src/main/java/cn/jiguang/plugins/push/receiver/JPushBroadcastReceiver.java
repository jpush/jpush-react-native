package cn.jiguang.plugins.push.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import cn.jiguang.plugins.push.common.JPushLogger;
import cn.jpush.android.api.JPushInterface;

public class JPushBroadcastReceiver extends BroadcastReceiver {

  public static Bundle NOTIFICATION_BUNDLE;

  @Override
  public void onReceive(Context context, Intent data) {
    if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(data.getAction())) {
      JPushLogger.e("JPushBroadcastReceiver ACTION_NOTIFICATION_OPENED");
      try {
        NOTIFICATION_BUNDLE = data.getExtras();
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        context.startActivity(intent);
      } catch (Throwable throwable) {
        JPushLogger.e("JPushBroadcastReceiver ACTION_NOTIFICATION_OPENED error:" + throwable.getMessage());
      }
    }
  }

}
