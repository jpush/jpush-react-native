package cn.jiguang.plugins.push.common;


import android.util.Log;

public class JLogger {

    public static final String TAG = "RN-JPush";

    private static boolean isLoggerEnable = false;

    public static void setLoggerEnable(boolean loggerEnable) {
        Log.d(TAG, "setLoggerEnable:" + loggerEnable);
        isLoggerEnable = loggerEnable;
    }

    public static void i(String msg) {
        if (isLoggerEnable) {
            Log.i(TAG, msg);
        }
    }

    public static void d(String msg) {
        if (isLoggerEnable) {
            Log.d(TAG, msg);
        }
    }

    public static void v(String msg) {
        if (isLoggerEnable) {
            Log.v(TAG, msg);
        }
    }

    public static void w(String msg) {
        if (isLoggerEnable) {
            Log.w(TAG, msg);
        }
    }

    public static void e(String error) {
        if (isLoggerEnable) {
            Log.e(TAG, error);
        }
    }

}

