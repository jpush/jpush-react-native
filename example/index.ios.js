'use strict';


import React from 'react';
import ReactNative from 'react-native';

var PushActivity = require('./react-native-iOS/push_activity.js');
var SetActivity = require('./react-native-iOS/set_activity');
var LocalPushActivity = require('./react-native-iOS/localPush_activity');

var {
  Text,
  TextInput,
  View,
  Navigator,
  BackAndroid,
  NativeModules,
  StyleSheet,
  AppRegistry
} = ReactNative;

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


var styles = StyleSheet.create({

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

AppRegistry.registerComponent('PushDemo', () => PushDemo);