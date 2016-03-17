'use strict';

var React = require('react-native');

var {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  PropTypes,
  requireNativeComponent,
  NativeModules,
  ScrollView,
  DeviceEventEmitter,
  NativeAppEventEmitter
} = React;

// var ToastAndroid = NativeModules.ToastAndroid;
var PushHelper = NativeModules.JPushHelper;
// var JSHelper = NativeModules.JSHelper;
var PushActivity = React.createClass({
    
    getInitialState: function() {
      return {
        bg: '#ffffff',
        appkey: 'AppKey',
        imei: 'IMEI',
        package: 'PackageName',
        deviceId: 'DeviceId',
        version: 'Version',
        pushToken: 'PushToken'
     };
    },
    jumpSetActivity() {
      this.props.navigator.push({ name:'setActivity' });
    },
    onInitPress() {
      // PushHelper.init( (success) => {
      //   // ToastAndroid.show(success, ToastAndroid.SHORT);
      // }, (error) => {
      //   // ToastAndroid.show(error, ToastAndroid.SHORT);
      // });
    },
    onStopPress() {
      // PushHelper.stopPush((success) => {
      //   ToastAndroid.show(success, ToastAndroid.SHORT);
      // }, (error) => {
      //   ToastAndroid.show(error, ToastAndroid.SHORT);
      // });
    },
    onResumePress() {
      // PushHelper.resumePush((success) => {
      //   ToastAndroid.show(success, ToastAndroid.SHORT);
      // }, (error) => {
      //   ToastAndroid.show(error, ToastAndroid.SHORT);
      // });
    },
    componentWillMount() {
      // JSHelper.initModule(
      //   (map) => {
      //     this.setState({
      //       appkey: map.myAppKey,
      //       imei: map.myImei,
      //       package: map.myPackageName,
      //       deviceId: map.myDeviceId,
      //       version: map.myVersion
      //     })
      //   }
      // );
      // DeviceEventEmitter.addListener('receivePushMsg', (data) => {
      //   this.setState({ pushMsg: data });
      // });
      console.log("huangmin 1234   ");
        var subscription = NativeAppEventEmitter.addListener('didRegisterToken', (token) => {
        console.log("huangmin 1234   99999");
        console.log(token);
        this.setState({ pushToken: token });
        console.log("huangmin 1234   99999");
      });


    },
    componentDidMount() {
          
    },
    componentWillUnmount() {
      DeviceEventEmitter.removeAllListeners();
      NativeAppEventEmitter.removeAllListeners();
    },
    render() {
      console.log("huangmin 5555   ");


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
              token: { this.state.pushToken }
            </Text>
            </ScrollView>

          )
    }
});

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



module.exports = PushActivity