package cn.jiguang.plugins.push;

import android.os.Bundle;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;

/** Typed extra data for cmd=2013 only; legacy cmd=2012 remains unchanged. */
public final class SubscriptionResultCodec {
    private SubscriptionResultCodec() { }

    public static WritableMap fromBundle(Bundle bundle) { return bundleMap(bundle, 0); }

    private static WritableMap bundleMap(Bundle bundle, int depth) {
        WritableMap map = Arguments.createMap();
        if (bundle != null && depth <= 16) {
            for (String key : bundle.keySet()) {
                if (!key.startsWith("intent_")) put(map, key, bundle.get(key), depth + 1);
            }
        }
        return map;
    }

    private static Object encode(Object value, int depth) {
        if (depth > 16) return null;
        if (value instanceof Bundle) return bundleMap((Bundle) value, depth);
        if (value instanceof Map) {
            WritableMap map = Arguments.createMap();
            for (Map.Entry<?, ?> entry : ((Map<?, ?>) value).entrySet()) {
                if (entry.getKey() instanceof String && !((String) entry.getKey()).startsWith("intent_")) {
                    put(map, (String) entry.getKey(), entry.getValue(), depth + 1);
                }
            }
            return map;
        }
        if (value instanceof List || (value != null && value.getClass().isArray())) {
            WritableArray array = Arguments.createArray();
            int size = value instanceof List ? ((List<?>) value).size() : Array.getLength(value);
            for (int i = 0; i < size; i++) {
                Object item = value instanceof List ? ((List<?>) value).get(i) : Array.get(value, i);
                push(array, encode(item, depth + 1));
            }
            return array;
        }
        if (value == null || value instanceof String || value instanceof Boolean || value instanceof Number) return value;
        return null; // No arbitrary native object stringification.
    }

    private static void put(WritableMap map, String key, Object value, int depth) {
        Object item = encode(value, depth);
        if (item == null) map.putNull(key);
        else if (item instanceof String) map.putString(key, (String) item);
        else if (item instanceof Boolean) map.putBoolean(key, (Boolean) item);
        else if (item instanceof Integer || item instanceof Short || item instanceof Byte) map.putInt(key, ((Number) item).intValue());
        else if (item instanceof Number) map.putDouble(key, ((Number) item).doubleValue());
        else if (item instanceof WritableMap) map.putMap(key, (WritableMap) item);
        else if (item instanceof WritableArray) map.putArray(key, (WritableArray) item);
    }

    private static void push(WritableArray array, Object item) {
        if (item == null) array.pushNull();
        else if (item instanceof String) array.pushString((String) item);
        else if (item instanceof Boolean) array.pushBoolean((Boolean) item);
        else if (item instanceof Integer || item instanceof Short || item instanceof Byte) array.pushInt(((Number) item).intValue());
        else if (item instanceof Number) array.pushDouble(((Number) item).doubleValue());
        else if (item instanceof WritableMap) array.pushMap((WritableMap) item);
        else if (item instanceof WritableArray) array.pushArray((WritableArray) item);
    }
}
