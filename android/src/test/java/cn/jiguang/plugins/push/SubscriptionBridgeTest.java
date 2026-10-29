package cn.jiguang.plugins.push;

import android.app.Activity;
import android.os.Bundle;
import com.facebook.react.bridge.*;
import com.facebook.react.common.LifecycleState;
import cn.jiguang.plugins.push.helper.JPushHelper;
import cn.jiguang.plugins.push.receiver.JPushModuleReceiver;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.CmdMessage;
import cn.jpush.android.api.VoipDataMessage;
import cn.jpush.android.ups.JPushUPSManager;
import cn.jpush.android.ups.UPSTurnCallBack;
import cn.jpush.android.ups.TokenResult;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.MockedStatic;
import org.mockito.ArgumentCaptor;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import java.util.*;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

@RunWith(RobolectricTestRunner.class)
@Config(manifest=Config.NONE, sdk=28)
public class SubscriptionBridgeTest {
    private MockedStatic<Arguments> arguments;
    private MockedStatic<UiThreadUtil> ui;
    private ReactApplicationContext context;
    private JPushModule module;
    @Before public void setUp() {
        arguments = mockStatic(Arguments.class);
        arguments.when(Arguments::createMap).thenAnswer(inv -> new JavaOnlyMap());
        arguments.when(Arguments::createArray).thenAnswer(inv -> new JavaOnlyArray());
        ui = mockStatic(UiThreadUtil.class);
        ui.when(() -> UiThreadUtil.runOnUiThread(any(Runnable.class))).thenAnswer(inv -> { inv.getArgument(0, Runnable.class).run(); return null; });
        context = mock(ReactApplicationContext.class);
        module = new JPushModule(context);
    }
    @After public void tearDown() { module.invalidate(); ui.close(); arguments.close(); }

    @Test public void invalidArraysNeverInvokeSDK() {
        try (MockedStatic<JPushInterface> sdk = mockStatic(JPushInterface.class)) {
            for (ReadableArray values : Arrays.asList(null, JavaOnlyArray.of(), JavaOnlyArray.of("a","b","c","d"),
                    JavaOnlyArray.of("a","a"), JavaOnlyArray.of(" "), JavaOnlyArray.of(1), JavaOnlyArray.of((Object)null))) {
                Promise promise = mock(Promise.class); module.requestSubscribeChannels(values, promise);
                verify(promise).reject(eq("INVALID_ARGUMENT"), anyString());
            }
            sdk.verifyNoInteractions();
        }
    }
    @Test public void missingOrBackgroundActivityRejectsWithoutNativeDispatch() {
        Promise promise = mock(Promise.class); module.requestSubscribeChannels(JavaOnlyArray.of("channel"), promise);
        verify(promise).reject(eq("NO_ACTIVITY"), anyString());
        Activity activity = mock(Activity.class); when(context.getCurrentActivity()).thenReturn(activity);
        when(activity.hasWindowFocus()).thenReturn(true); when(context.getLifecycleState()).thenReturn(LifecycleState.BEFORE_RESUME);
        Promise background = mock(Promise.class); module.requestSubscribeChannels(JavaOnlyArray.of("channel"), background);
        verify(background).reject(eq("NO_ACTIVITY"), anyString());
    }
    @Test public void foregroundDispatchPreservesIDsAndDoesNotInventFinalResult() {
        Activity activity = mock(Activity.class); when(context.getCurrentActivity()).thenReturn(activity);
        when(activity.hasWindowFocus()).thenReturn(true); when(context.getLifecycleState()).thenReturn(LifecycleState.RESUMED);
        try (MockedStatic<JPushInterface> sdk = mockStatic(JPushInterface.class)) {
            Promise promise = mock(Promise.class); module.requestSubscribeChannels(JavaOnlyArray.of("one","two"), promise);
            sdk.verify(() -> JPushInterface.requestSubscribeChannels(activity, Arrays.asList("one","two")));
            verify(promise).resolve(null); verifyNoMoreInteractions(promise);
        }
    }
    @Test public void cmd2013RetainsNestedValuesAnd2012KeepsLegacyFields() {
        try (MockedStatic<JPushHelper> helper = mockStatic(JPushHelper.class)) {
            Bundle nested = new Bundle(); nested.putBoolean("allowed", true); nested.putInt("code", 100);
            Bundle extra = new Bundle(); extra.putParcelableArrayList("items", new ArrayList<>(Arrays.asList(nested)));
            extra.putString("channels", "[{\"code\":100}]"); extra.putString("intent_private", "not emitted");
            CmdMessage current = new CmdMessage(2013,0); current.cmd=2013; current.errorCode=0; current.msg="fixture"; current.extra=extra;
            new JPushModuleReceiver().onCommandResult(null, current);
            ArgumentCaptor<WritableMap> captor=ArgumentCaptor.forClass(WritableMap.class);
            helper.verify(() -> JPushHelper.sendEvent(eq("CommandEvent"), captor.capture()));
            ReadableMap out=captor.getValue(); assertEquals("[{\"code\":100}]", out.getString("channels"));
            ReadableMap data=out.getMap("commandData"); assertFalse(data.hasKey("intent_private"));
            assertTrue(data.getArray("items").getMap(0).getBoolean("allowed")); assertEquals(100,data.getArray("items").getMap(0).getInt("code"));
            helper.clearInvocations(); Bundle legacy=new Bundle();legacy.putString("open_channel_result","[]");legacy.putInt("jg_platform",1);
            CmdMessage old=new CmdMessage(2012,0);old.cmd=2012;old.extra=legacy;
            new JPushModuleReceiver().onCommandResult(null,old);
            helper.verify(() -> JPushHelper.sendEvent(eq("CommandEvent"),captor.capture()));
            out=captor.getValue(); assertEquals("[]",out.getString("openChannelResult"));assertEquals(1,out.getInt("platform"));
            assertFalse(out.hasKey("commandData"));assertFalse(out.hasKey("channels"));assertEquals(ReadableType.String,out.getType("commandExtra"));
        }
    }
    @Test public void pushServiceCallsKeepIndependentNativeCodesAndIgnoreAfterDestroy() {
        List<UPSTurnCallBack> callbacks=new ArrayList<>();
        try (MockedStatic<JPushUPSManager> sdk=mockStatic(JPushUPSManager.class)) {
            sdk.when(() -> JPushUPSManager.turnOffPush(eq(context), any(UPSTurnCallBack.class)))
                .thenAnswer(inv -> {callbacks.add(inv.getArgument(1));return null;});
            Promise a=mock(Promise.class),b=mock(Promise.class);module.turnOffPush(a);module.turnOffPush(b);
            callbacks.get(1).onResult(new TokenResult("",104));callbacks.get(0).onResult(new TokenResult("",0));
            ArgumentCaptor<Object> ca=ArgumentCaptor.forClass(Object.class),cb=ArgumentCaptor.forClass(Object.class);
            verify(a).resolve(ca.capture());verify(b).resolve(cb.capture());
            assertEquals(0,((ReadableMap)ca.getValue()).getInt("code"));assertEquals(104,((ReadableMap)cb.getValue()).getInt("code"));
            Promise late=mock(Promise.class);module.turnOffPush(late);module.onCatalystInstanceDestroy();callbacks.get(2).onResult(new TokenResult("",0));verifyNoInteractions(late);
        }
    }
    @Test public void voipCallbackRetainsNewSupportStatusWithoutCoercion() {
        try (MockedStatic<JPushHelper> helper=mockStatic(JPushHelper.class)) {
            VoipDataMessage message=new VoipDataMessage();message.setMessageId("fixture");message.setExtraData("{}");
            message.setPlatform((byte)1);message.setVoipSupportStatus(-99);
            new JPushModuleReceiver().onVoipMessage(null,message);
            ArgumentCaptor<WritableMap> captor=ArgumentCaptor.forClass(WritableMap.class);
            helper.verify(() -> JPushHelper.sendEvent(eq("VoipMessageEvent"),captor.capture()));
            assertEquals(-99,captor.getValue().getInt("voipSupportStatus"));
            assertEquals("fixture",captor.getValue().getString("messageId"));
        }
    }
    @Test public void nativeThrowAndNullResultRejectRatherThanSucceed() {
        try (MockedStatic<JPushUPSManager> sdk=mockStatic(JPushUPSManager.class)) {
            sdk.when(() -> JPushUPSManager.turnOnPush(eq(context),any(UPSTurnCallBack.class))).thenThrow(new IllegalStateException("fixture"));
            Promise thrown=mock(Promise.class);module.turnOnPush(thrown);verify(thrown).reject(eq("NATIVE_EXCEPTION"),anyString());
            sdk.when(() -> JPushUPSManager.turnOffPush(eq(context),any(UPSTurnCallBack.class)))
                .thenAnswer(inv -> {inv.getArgument(1,UPSTurnCallBack.class).onResult(null);return null;});
            Promise empty=mock(Promise.class);module.turnOffPush(empty);verify(empty).reject(eq("NATIVE_EXCEPTION"),anyString());
        }
    }
}
