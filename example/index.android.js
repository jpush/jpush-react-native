/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React from 'react';
import ReactNative from 'react-native';
import PushActivity from './react-native-android/push_activity';
import SetActivity from './react-native-android/set_activity';
import SecondActivity from './react-native-android/second';

const {
  AppRegistry,
  BackAndroid,
} = ReactNative;
import {
  StackNavigator
} from 'react-navigation';
import JPushModule from 'jpush-react-native';

const PushDemoApp = StackNavigator({
  Home: {
    screen: PushActivity
  },
  Setting: {
    screen: SetActivity
  },
  Push: {
    screen: SecondActivity
  }
})

AppRegistry.registerComponent('PushDemoApp', () => PushDemoApp);