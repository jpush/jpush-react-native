import React from 'react'
import ReactNative from 'react-native'
import JPushModule from 'jpush-react-native'

const { View, Text, TouchableHighlight, StyleSheet } = ReactNative

export default class Second extends React.Component {

  componentDidMount() {
    // Receive extra 
    JPushModule.addReceiveExtrasListener(map => {
      console.log('Got extra, key: hello, value: ' + map.hello)
    })
  }

  render() {
    return (
      <View>
        <Text style={styles.welcome}>Welcome !</Text>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  welcome: {
    textAlign: 'center',
    margin: 10
  },
})
