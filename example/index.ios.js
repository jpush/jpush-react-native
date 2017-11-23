'use strict';


import React from 'react';
import {
	AppRegistry,
} from 'react-native';

import {
	StackNavigator
} from 'react-navigation';

var PushActivity = require('./react-native-iOS/push_activity.js');
var SetActivity = require('./react-native-iOS/set_activity');
var LocalPushActivity = require('./react-native-iOS/localPush_activity');

const PushDemo = StackNavigator({
  Home: {
    screen: PushActivity
  },
  Setting: {
    screen: SetActivity
  },
  LocalPush: {
    screen: LocalPushActivity
  }
})

AppRegistry.registerComponent('PushDemo', () => PushDemo);