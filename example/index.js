import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import Second from './Second'
import App from './App'

const PushDemo = StackNavigator({
  Home: {
    screen: App
  },
  Push: {
    screen: Second
  }
})

AppRegistry.registerComponent('PushDemo', () => PushDemo)
