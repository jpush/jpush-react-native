'use strict';

import React from 'react-native';
import PushActivity from './push_activity';
import SetActivity from './set_activity';
var {
  BackAndroid,
  Component,
  Text,
  TextInput,
  View,
  Navigator,
} = React;

var navigator;
class PushDemoApp extends Component {

  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
  }

  configureScene(route) {
    return Navigator.SceneConfigs.FadeAndroid;
  }

  renderScene(router, navigator) {
    var Component = null;
    this.navigator = navigator;
    switch(router.name) {
      case "pushActivity":
        Component = PushActivity;
        break;
      case "setActivity":
        Component = SetActivity;
        break;
      case "webActivity":
        Component = WebActivity;
        break;
    }

    return <Component navigator = { navigator } />
  }

  componentDidMount() {
      var navigator = this.navigator;
      BackAndroid.addEventListener('hardwareBackPress', function() {
          if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
          }
          return false;
      });
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress');
  }

    render() {
      return (
          <Navigator
              initialRoute = { {name: 'pushActivity' }}
              configureScene = { this.configureScene }
              renderScene = { this.renderScene } />
        );
    }
}

React.AppRegistry.registerComponent('PushDemoApp', () => PushDemoApp);