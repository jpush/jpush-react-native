'use strict';

import React from 'react-native';

var {
  Component,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  PropTypes,
  requireNativeComponent,
  NativeModules,
  ScrollView,
  DeviceEventEmitter
} = React;

var ToastAndroid = NativeModules.ToastAndroid;
var PushHelper = NativeModules.PushHelper;
var JSHelper = NativeModules.JSHelper;
export default class PushActivity  extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bg: '#ffffff',
      appkey: 'AppKey',
      imei: 'IMEI',
      package: 'PackageName',
      deviceId: 'DeviceId',
      version: 'Version',
      pushMsg: 'PushMessage'
    }

    this.jumpSetActivity = this.jumpSetActivity.bind(this);
    this.onInitPress = this.onInitPress.bind(this);
    this.onStopPress = this.onStopPress.bind(this);
    this.onResumePress = this.onResumePress.bind(this);
  }
    
  jumpSetActivity() {
    this.props.navigator.push({ name:'setActivity' }); 
  }

  onInitPress() {
    PushHelper.init( (success) => {
      ToastAndroid.show(success, ToastAndroid.SHORT);
    }, (error) => {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

    onStopPress() {
      PushHelper.stopPush((success) => {
        ToastAndroid.show(success, ToastAndroid.SHORT);
      }, (error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
    }

    onResumePress() {
      PushHelper.resumePush((success) => {
        ToastAndroid.show(success, ToastAndroid.SHORT);
      }, (error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
    }

    componentWillMount() {
      JSHelper.initModule(
        (map) => {
          this.setState({
            appkey: map.myAppKey,
            imei: map.myImei,
            package: map.myPackageName,
            deviceId: map.myDeviceId,
            version: map.myVersion
          })
        }
      );
      DeviceEventEmitter.addListener('receivePushMsg', (data) => {
        this.setState({ pushMsg: data });
      });
    }

    componentDidMount() {
          
    }

    componentWillUnmount() {
      DeviceEventEmitter.removeAllListeners();
    }

    render() {
        return (
            <ScrollView style = { styles.parent }>
            
            <Text style = { styles.textStyle }>
              { this.state.appkey }
            </Text>
            <Text style = { styles.textStyle }>
              { this.state.imei }
            </Text>
            <Text style  = { styles.textStyle }>
              { this.state.package }
            </Text>
            <Text style = { styles.textStyle }>
              { this.state.deviceId }
            </Text> 
            <Text style = { styles.textStyle }>
              { this.state.version }
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
              onPress = { this.onStopPress }>
                <Text style = { styles.btnTextStyle }>
                  STOPPUSH
                </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor = '#f5a402'
              activeOpacity = { 0.5 }
              style = { styles.btnStyle }
              onPress = { this.onResumePress }>
                <Text style = { styles.btnTextStyle }> 
                  RESUMEPUSH
                </Text>
            </TouchableHighlight>
            <Text style = { styles.textStyle }>
              { this.state.pushMsg }
            </Text>
            </ScrollView>

          )
    }
}

var styles = React.StyleSheet.create({
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