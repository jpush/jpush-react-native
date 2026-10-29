package cn.jiguang.plugins.push;

import com.facebook.react.bridge.Promise;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.Set;

/** Per-module replies. SDK callbacks never retain a Promise after bridge invalidation. */
final class PendingPromiseRegistry {
    interface Dispatcher { void dispatch(Runnable runnable); }
    private final Dispatcher dispatcher;
    private final Set<Pending> pending = Collections.newSetFromMap(new IdentityHashMap<Pending, Boolean>());
    private boolean active = true;

    PendingPromiseRegistry(Dispatcher dispatcher) { this.dispatcher = dispatcher; }

    synchronized Pending start(Promise promise) {
        if (!active) {
            dispatcher.dispatch(() -> promise.reject("BRIDGE_INVALIDATED", "React Native bridge is invalidated"));
            return null;
        }
        Pending reply = new Pending(promise);
        pending.add(reply);
        return reply;
    }

    synchronized boolean isActive() { return active; }

    synchronized void invalidate() {
        active = false;
        for (Pending reply : pending) reply.promise = null;
        pending.clear();
    }

    final class Pending {
        private Promise promise;
        private Pending(Promise promise) { this.promise = promise; }
        void resolve(Object value) { finish(value, null, null); }
        void reject(String code, String message) { finish(null, code, message); }
        private void finish(Object value, String code, String message) {
            dispatcher.dispatch(() -> {
                synchronized (PendingPromiseRegistry.this) {
                    if (!active || !pending.remove(this) || promise == null) return;
                    Promise target = promise;
                    promise = null;
                    if (code == null) target.resolve(value); else target.reject(code, message);
                }
            });
        }
    }
}
