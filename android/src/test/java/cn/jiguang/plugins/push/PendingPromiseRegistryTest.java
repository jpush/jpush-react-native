package cn.jiguang.plugins.push;

import com.facebook.react.bridge.Promise;
import org.junit.Test;
import java.util.ArrayList;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

public class PendingPromiseRegistryTest {
    @Test public void outOfOrderAndDuplicateCallbacksDoNotCrossCalls() {
        List<Runnable> queue = new ArrayList<>();
        PendingPromiseRegistry registry = new PendingPromiseRegistry(queue::add);
        Promise first = mock(Promise.class), second = mock(Promise.class);
        PendingPromiseRegistry.Pending a = registry.start(first), b = registry.start(second);
        b.resolve("second"); a.resolve("first"); a.resolve("duplicate"); a.reject("late", "late");
        for (Runnable task : queue) task.run();
        verify(first).resolve("first"); verify(second).resolve("second");
        verifyNoMoreInteractions(first, second);
    }
    @Test public void simultaneousCallbacksSettleExactlyOnce() throws Exception {
        PendingPromiseRegistry registry = new PendingPromiseRegistry(Runnable::run);
        Promise promise = mock(Promise.class); PendingPromiseRegistry.Pending reply = registry.start(promise);
        Thread one = new Thread(() -> reply.resolve("one"));
        Thread two = new Thread(() -> reply.reject("two", "two"));
        one.start(); two.start(); one.join(); two.join();
        assertEquals(1, mockingDetails(promise).getInvocations().size());
    }
    @Test public void invalidateDropsQueuedAndLateResultsAndReleasesPromise() throws Exception {
        List<Runnable> queue = new ArrayList<>(); PendingPromiseRegistry registry = new PendingPromiseRegistry(queue::add);
        Promise promise = mock(Promise.class); PendingPromiseRegistry.Pending reply = registry.start(promise);
        reply.resolve("queued"); registry.invalidate(); reply.resolve("late");
        for (Runnable task : queue) task.run(); verifyNoInteractions(promise);
        java.lang.reflect.Field field = reply.getClass().getDeclaredField("promise"); field.setAccessible(true);
        assertNull(field.get(reply));
        Promise next = mock(Promise.class); assertNull(registry.start(next)); queue.get(queue.size()-1).run();
        verify(next).reject("BRIDGE_INVALIDATED", "React Native bridge is invalidated");
    }
}
