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
  DeviceEventEmitter,
  NativeAppEventEmitter,
  StyleSheet,
  Alert,
} = ReactNative;

import JPushModule from 'jpush-react-native';

var PushActivity = React.createClass({
    
    getInitialState: function() {
      return {
        bg: '#ffffff',
        regid: '',
        connectStatus: '',
        package: 'PackageName',
        deviceId: 'DeviceId',
     };
    },
    jumpSetActivity() {
      this.props.navigator.push({ name:'setActivity' });
    },
    onInitPress() {

      console.log('on click init push ');
      JPushModule.getRegistrationID((registrationid) => {
        console.log(registrationid);
        this.setState({regid: registrationid});
      });
    },
    onSetuplocalNotificationPress() {
      this.props.navigator.push({ name:'LocalPushActivity' });
    },
    componentWillMount() {

        JPushModule.setupPush()  // if you add register notification in Appdelegate.m 有 don't need call this function
        JPushModule.addnetworkDidLoginListener(() => {
          console.log('连接已登录')
          JPushModule.addTags(['dasffas'], (result)=> {
            Alert.alert('addTags success:' + JSON.stringify(result))
          })
        })

        JPushModule.addOpenNotificationLaunchAppListener((result) => {
          Alert.alert('addOpenNotificationLaunchAppListener', 'the notification is :' + JSON.stringify(result))
        })

        JPushModule.addReceiveOpenNotificationListener((result) => {
          Alert.alert('addReceiveOpenNotificationListener',JSON.stringify(result))
        })

        JPushModule.addReceiveNotificationListener((result) => {
          Alert.alert('addReceiveNotificationListener',JSON.stringify(result))
        })

        JPushModule.addConnectionChangeListener((result) => {
          if (result) {
            console.log('网络已连接')
          } else {
          console.log('网络已断开')
          }
        })

        // JPushModule.addReceiveNotificationListener((notification) => {
        //   Alert.alert(JSON.stringify(notification))
        // })
    },
    componentDidMount() {

    },
    componentWillUnmount() {
      DeviceEventEmitter.removeAllListeners();
      NativeAppEventEmitter.removeAllListeners();
    },
    render() {

        return (
            <ScrollView style = { styles.parent }>
            
            <Text style = { styles.textStyle }>
              RegistrationID: { this.state.regid }
            </Text>
            <Text style = { styles.textStyle }>
              链接状态： { this.state.connectStatus }
            </Text>
            <Text style  = { styles.textStyle }>
              { this.state.package }
            </Text>
            <Text style = { styles.textStyle }>
              { this.state.deviceId }
            </Text> 
            <TouchableHighlight
              underlayColor = '#0866d9'
              activeOpacity = { 0.5 }
              style = { styles.btnStyle }
              onPress = { this.jumpSetActivity }>
              <Text style = { styles.btnTextStyle }>
                设置
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor = '#0866d9'
              activeOpacity = { 0.5 }
              style = { styles.btnStyle }
              onPress = { this.onInitPress }>
                <Text style = { styles.btnTextStyle }>
                  INITPUSH
                </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor = '#e4083f'
              activeOpacity = { 0.5 }
              style = { styles.btnStyle }
              onPress = { this.onSetuplocalNotificationPress }>
                <Text style = { styles.btnTextStyle }>
                  local notification
                </Text>
            </TouchableHighlight>
            </ScrollView>

          )
    }
});

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



module.exports = PushActivity