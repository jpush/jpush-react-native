import { AppRegistry } from 'react-native';
import {
    StackNavigator
  } from 'react-navigation';
import App from './App';
import SecondActivity from './second';

const PushDemoApp = StackNavigator({
    Home: {
      screen: App
    },
    Push: {
      screen: SecondActivity
    }
  })


AppRegistry.registerComponent('PushDemoApp', () => PushDemoApp);
