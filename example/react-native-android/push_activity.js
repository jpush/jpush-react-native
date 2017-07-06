'use strict';

import React from 'react';
import ReactNative from 'react-native';

const {
	Text,
	View,
	TextInput,
	TouchableHighlight,
	PropTypes,
	requireNativeComponent,
	NativeModules,
	ScrollView,
	StyleSheet,
	DeviceEventEmitter,
} = ReactNative;

import JPushModule from 'jpush-react-native';
const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";
export default class PushActivity extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			bg: '#ffffff',
			appkey: 'AppKey',
			imei: 'IMEI',
			package: 'PackageName',
			deviceId: 'DeviceId',
			version: 'Version',
			pushMsg: 'PushMessage',
			registrationId: 'registrationId',
		};

		this.jumpSetActivity = this.jumpSetActivity.bind(this);
		this.onInitPress = this.onInitPress.bind(this);
		this.onStopPress = this.onStopPress.bind(this);
		this.onResumePress = this.onResumePress.bind(this);
		this.onGetRegistrationIdPress = this.onGetRegistrationIdPress.bind(this);
		this.jumpSecondActivity = this.jumpSecondActivity.bind(this);
	}

	jumpSetActivity() {
		this.props.navigator.push({
			name: 'setActivity'
		});
	}

	jumpSecondActivity() {
		console.log("jump to SecondActivity");
		JPushModule.jumpToPushActivity("SecondActivity");
		// this.props.navigator.push({
		// 	name: "second"
		// });
	}

	onInitPress() {
		JPushModule.initPush();
	}

	onStopPress() {
		JPushModule.stopPush();
		console.log("Stop push press");
	}

	onResumePress() {
		JPushModule.resumePush();
		console.log("Resume push press");
	}

	onGetRegistrationIdPress() {
		JPushModule.getRegistrationID((registrationId) => {
			this.setState({
				registrationId: registrationId
			});
		});
	}

	componentWillMount() {}

	componentDidMount() {
		JPushModule.getInfo((map) => {
			this.setState({
				appkey: map.myAppKey,
				imei: map.myImei,
				package: map.myPackageName,
				deviceId: map.myDeviceId,
				version: map.myVersion
			});
		});
		JPushModule.notifyJSDidLoad((resultCode) => {
			if (resultCode === 0) {
				JPushModule.addReceiveCustomMsgListener((map) => {
					this.setState({
						pushMsg: map.message
					});
					console.log("extras: " + map.extras);
				});
				JPushModule.addReceiveNotificationListener((map) => {
					console.log("alertContent: " + map.alertContent);
					console.log("extras: " + map.extras);
					// var extra = JSON.parse(map.extras);
					// console.log(extra.key + ": " + extra.value);
				});
				JPushModule.addReceiveOpenNotificationListener((map) => {
					console.log("Opening notification!");
					console.log("map.extra: " + map.key);
					JPushModule.jumpToPushActivity("SecondActivity");
				});
				JPushModule.addGetRegistrationIdListener((registrationId) => {
					console.log("Device register succeed, registrationId " + registrationId);
				});
			}
		});
	}

	componentWillUnmount() {
		JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
		JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
		console.log("Will clear all notifications");
		JPushModule.clearAllNotifications();
	}

	render() {
		return (
			<ScrollView style={ styles.parent }>

                <Text style={ styles.textStyle }>
                    { this.state.appkey }
                </Text>
                <Text style={ styles.textStyle }>
                    { this.state.imei }
                </Text>
                <Text style={ styles.textStyle }>
                    { this.state.package }
                </Text>
                <Text style={ styles.textStyle }>
                    { this.state.deviceId }
                </Text>
                <Text style={ styles.textStyle }>
                    { this.state.version }
                </Text>
                <TouchableHighlight
                    underlayColor='#0866d9'
                    activeOpacity={ 0.5 }
                    style={ styles.btnStyle }
                    onPress={ this.jumpSetActivity }>
                    <Text style={ styles.btnTextStyle }>
                        设置
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#0866d9'
                    activeOpacity={ 0.5 }
                    style={ styles.btnStyle }
                    onPress={ this.onInitPress }>
                    <Text style={ styles.btnTextStyle }>
                        INITPUSH
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#e4083f'
                    activeOpacity={ 0.5 }
                    style={ styles.btnStyle }
                    onPress={ this.onStopPress }>
                    <Text style={ styles.btnTextStyle }>
                        STOPPUSH
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#f5a402'
                    activeOpacity={ 0.5 }
                    style={ styles.btnStyle }
                    onPress={ this.onResumePress }>
                    <Text style={ styles.btnTextStyle }>
                        RESUMEPUSH
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#f5a402'
                    activeOpacity={ 0.5 }
                    style={ styles.btnStyle }
                    onPress={ this.onGetRegistrationIdPress }>
                    <Text style={ styles.btnTextStyle }>
                        GET REGISTRATIONID
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#f5a402'
                    activeOpacity={ 0.5 }
                    style={ styles.btnStyle }
                    onPress={ this.jumpSecondActivity }>
                    <Text style={ styles.btnTextStyle }>
                        Go to SecondActivity
                    </Text>
                </TouchableHighlight>
                <Text style={ styles.textStyle }>
                    { this.state.pushMsg }
                </Text>
                <Text style={styles.textStyle}>
                    { this.state.registrationId }
                </Text>
            </ScrollView>

		)
	}
}

var styles = StyleSheet.create({
	parent: {
		padding: 15,
		backgroundColor: '#f0f1f3'
	},

	textStyle: {
		marginTop: 10,
		textAlign: 'center',
		fontSize: 20,
		color: '#808080'
	},

	btnStyle: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: '#3e83d7',
		borderRadius: 8,
		backgroundColor: '#3e83d7'
	},
	btnTextStyle: {
		textAlign: 'center',
		fontSize: 25,
		color: '#ffffff'
	},
	inputStyle: {
		borderColor: '#48bbec',
		borderWidth: 1,

	},
});