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

var PushHelper = NativeModules.JPushHelper;
var PushActivity = React.createClass({
    
    getInitialState: function() {
      return {
        bg: '#ffffff',
        appkey: '',
        connectStatus: '',
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

      console.log('on click init push ');
      PushHelper.setupPush('dssdf');

      PushHelper.getAppkeyWithcallback((theKey) => {
      this.setState({appkey: theKey});
      });
    },
    onSetuplocalNotificationPress() {
      this.props.navigator.push({ name:'LocalPushActivity' });
    },
    componentWillMount() {
      
        var subscription = NativeAppEventEmitter.addListener('didRegisterToken', (token) => {
        this.setState({ pushToken: token });
        });
        NativeAppEventEmitter.addListener('networkDidSetup', (token) => {
        this.setState({ connectStatus: '已连接' });
        });
        NativeAppEventEmitter.addListener('networkDidClose', (token) => {
        this.setState({ connectStatus: '连接已断开' });
        });
        NativeAppEventEmitter.addListener('networkDidRegister', (token) => {
        this.setState({ connectStatus: '已注册' });
        });
        NativeAppEventEmitter.addListener('networkDidLogin', (token) => {
        this.setState({ connectStatus: '已登陆' });
        });
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
              Appkey: { this.state.appkey }
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
              onPress = { this.onSetuplocalNotificationPress }>
                <Text style = { styles.btnTextStyle }>
                  local notification
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