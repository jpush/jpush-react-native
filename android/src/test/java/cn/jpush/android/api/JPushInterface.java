package cn.jpush.android.api;
import android.app.Activity;
import java.util.List;
/** JVM-only SDK boundary: release sources compile against the genuine Maven AAR, not this class.
 * The vendor AAR has Android-specific obfuscated stack frames which desktop HotSpot cannot verify.
 * This fixture permits contract tests without disabling JVM verification or initializing the SDK. */
public final class JPushInterface {
    public static void requestSubscribeChannels(Activity activity, List<String> channels) { }
}
