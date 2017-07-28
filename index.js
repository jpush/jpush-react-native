import {
	NativeModules,
	Platform,
	DeviceEventEmitter
} from 'react-native';

const JPushModule = NativeModules.JPushModule;
const listeners = {};
const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";
const connectionChangeEvent = "connectionChange";

/**
 * Logs message to console with the [JPush] prefix
 * @param  {string} message
 */
const log = (message) => {
		console.log(`[JPush] ${message}`);
	}
	// is function
const isFunction = (fn) => typeof fn === 'function';
/**
 * create a safe fn env
 * @param  {any} fn
 * @param  {any} success
 * @param  {any} error
 */
const safeCallback = (fn, success, error) => {

	JPushModule[fn](function(params) {
		log(params);
		isFunction(success) && success(params)
	}, function(error) {
		log(error)
		isFunction(error) && error(error)
	})

}

export default class JPush {

	/**
	 * Android only
	 * 初始化JPush 必须先初始化才能执行其他操作
	 */
	static initPush() {
		JPushModule.initPush();
	}

	/**
	 * Android
	 */
	static stopPush() {
		JPushModule.stopPush();
	}

	/**
	 * Android
	 */
	static resumePush() {
		JPushModule.resumePush();
	}

	static notifyJSDidLoad(cb) {
		JPushModule.notifyJSDidLoad((resultCode) => {
			cb(resultCode);
		});
	}

	/**
	 * Android
	 */
	static clearAllNotifications() {
		JPushModule.clearAllNotifications();
	}

	/**
	 * Android
	 */
	static clearNotificationById(id) {
		JPushModule.clearNotificationById(id);
	}

	/**
	 * Android
	 */
	static getInfo(cb) {
		JPushModule.getInfo((map) => {
			cb(map);
		});
	}

	static getConnectionState(cb) {
		JPushModule.getConnectionState((state) => {
			cb(state);
		});
	}

	static setTags(tags, cb) {
		JPushModule.setTags(tags, (map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static addTags(tags, cb) {
		JPushModule.addTags(tags, (map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static deleteTags(tags, cb) {
		JPushModule.deleteTags(tags, (map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static cleanTags(cb) {
		JPushModule.cleanTags((map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static getAllTags(cb) {
		JPushModule.getAllTags((map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static checkTagBindState(tag, cb) {
		JPushModule.checkTagBindState(tag, (map) => {
			cb(map);
		});
	}

	static setAlias(alias, cb) {
		JPushModule.setAlias(alias, (map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static deleteAlias(cb) {
		JPushModule.deleteAlias((map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static getAlias(cb) {
		JPushModule.getAlias((map) => {
			cb(map);
		});
	}

	/**
	 * Android
	 */
	static setStyleBasic() {
		JPushModule.setStyleBasic();
	}

	/**
	 * Android
	 */
	static setStyleCustom() {
		JPushModule.setStyleCustom();
	}

	/**
	 * Android
	 */
	static jumpToPushActivity(activityName) {
		JPushModule.jumpToPushActivity(activityName);
	}

	/**
	 * Android
	 */
	static finishActivity() {
		JPushModule.finishActivity();
	}

	/**
	 * Android
	 */
	static addReceiveCustomMsgListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(receiveCustomMsgEvent,
			(message) => {
				cb(message);
			});
	}

	/**
	 * Android
	 */
	static removeReceiveCustomMsgListener(cb) {
		if (!listeners[cb]) {
			return;
		}
		listeners[cb].remove();
		listeners[cb] = null;
	}

	/**
	 * Android
	 */
	static addReceiveNotificationListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(receiveNotificationEvent,
			(map) => {
				cb(map);
			});
	}

	/**
	 * Android
	 */
	static removeReceiveNotificationListener(cb) {
		if (!listeners[cb]) {
			return;
		}
		listeners[cb].remove();
		listeners[cb] = null;
	}

	/**
	 * Android
	 */
	static addReceiveOpenNotificationListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(openNotificationEvent,
			(message) => {
				cb(message);
			});
	}

	/**
	 * Android
	 */
	static removeReceiveOpenNotificationListener(cb) {
		if (!listeners[cb]) {
			return;
		}
		listeners[cb].remove();
		listeners[cb] = null;
	}

	/**
	 * Android
	 * If device register succeed, the server will return registrationId
	 */
	static addGetRegistrationIdListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(getRegistrationIdEvent,
			(registrationId) => {
				cb(registrationId);
			});
	}

	/**
	 * Android Only
	 */
	static removeGetRegistrationIdListener(cb) {
		if (!listeners[cb]) {
			return;
		}
		listeners[cb].remove();
		listeners[cb] = null;
	}

	static addConnectionChangeListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(connectionChangeEvent,
			(state) => {
				cb(state);
			});
	}

	static removeConnectionChangeListener(cb) {
		if (!listeners[cb]) {
			return;
		}
		listeners[cb].remove();
		listeners[cb] = null;
	}

	/**
	 * iOS,  Android	
	 */
	static getRegistrationID(cb) {
		JPushModule.getRegistrationID((id) => {
			cb(id);
		});
	}

	/**
	 * iOS
	 */
	static setupPush() {
		JPushModule.setupPush();
	}

	/**
	 * iOS
	 */
	static getAppkeyWithcallback(cb) {
		JPushModule.getAppkeyWithcallback((appkey) => {
			cb(appkey);
		});
	}


	/**
	 * iOS
	 */
	static setLocalNotification(date, textContain, badge, alertAction, notificationKey, userInfo, soundName) {
		JPushModule.setLocalNotification(date, textContain, badge, alertAction, notificationKey, userInfo, soundName);
	}

	/**
	 * iOS
	 */
	static setBadge(badge, cb) {
		JPushModule.setBadge(badge, (value) => {
			cb(value);
		});
	}

	//  add listener
	// NativeAppEventEmitter.addListener('networkDidSetup', (token) => {
	//
	// });
	// NativeAppEventEmitter.addListener('networkDidClose', (token) => {
	//
	// });
	// NativeAppEventEmitter.addListener('networkDidRegister', (token) => {
	//
	// });
	// NativeAppEventEmitter.addListener('networkDidLogin', (token) => {
	//
	// });
}