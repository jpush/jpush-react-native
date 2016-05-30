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
      // PushHelper.setupPush('dssdf');
      JPushModule.getRegistrationID((registrationid) => {
        console.log(registrationid);
        this.setState({regid: registrationid});
      });
    },
    onSetuplocalNotificationPress() {
      this.props.navigator.push({ name:'LocalPushActivity' });
    },
    componentWillMount() {
      
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