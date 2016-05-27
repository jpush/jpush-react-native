/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React from 'react';
import ReactNative from 'react-native';
import PushActivity from './push_activity';
import SetActivity from './set_activity';

const {
  AppRegistry,
  BackAndroid,
  Navigator,

} = ReactNative;
import JPushModule from 'jpush-react-native';

var navigator;
class PushDemoApp extends React.Component {

  constructor(props) {
    super(props);
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
    }

    return <Component navigator = { navigator } />
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

AppRegistry.registerComponent('PushDemoApp', () => PushDemoApp);
