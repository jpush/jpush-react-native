'use strict';

var React = require('react-native');
// var ToastAndroid = require('ToastAndroid');
var PushActivity = require('./react-native-ios/push_activity.js');
var SetActivity = require('./react-native-ios/set_activity');
var LocalPushActivity = require('./react-native-ios/localPush_activity');
// var WebActivity = require('./react-native-iOS/web_activity');
var {
  Text,
  TextInput,
  View,
  Navigator,
  BackAndroid,
  NativeModules
} = React;

var PushDemo = React.createClass({

  configureScene(route) {
      return Navigator.SceneConfigs.FloatFromRight;
  },

  renderScene(router, navigator) {
      var Component = null;
      this._navigator = navigator;
      switch(router.name) {
        case "pushActivity":
          Component = PushActivity;
          break;
        case "setActivity":
          Component = SetActivity;
          break;
        case "LocalPushActivity":
          Component = LocalPushActivity;
          break;
      }
      return <Component navigator = { navigator } />
  },

  render() {
    return (
        <Navigator
            initialRoute = { {name: 'pushActivity' }}
            configureScene = { this.configureScene }
            renderScene = { this.renderScene } />
      );
  }
});


var styles = React.StyleSheet.create({

    // For the container View
    parent: {
        padding: 16
    },

    backBtnStyle: {
      borderWidth: 1,
      borderColor: '#3f80dc',
      borderRadius: 5
    },

    backBtnText: {
      textAlign: 'center',
      fontSize: 25,
      color: '#ffffff'
    },
    buttonStyle: {
    marginTop: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#48bbec',
    borderRadius: 8,
    justifyContent:'center',
    alignSelf:'stretch',
    flexDirection: 'row',
    backgroundColor:'#48bbec'

  },
  buttonText: {    
    fontSize: 25,
    color: '#ffffff',
  }
});

React.AppRegistry.registerComponent('PushDemo', () => PushDemo);