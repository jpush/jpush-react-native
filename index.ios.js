// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  */
// 'use strict';
// import React, {
//   AppRegistry,
//   Component,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

// class PushDemo extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.ios.js
//         </Text>
//         <Text style={styles.instructions}>
//           Press Cmd+R to reload,{'\n'}
//           Cmd+D or shake for dev menu
//         </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// AppRegistry.registerComponent('PushDemo', () => PushDemo);


'use strict';

var React = require('react-native');
// var ToastAndroid = require('ToastAndroid');
var PushActivity = require('./react-native-iOS/push_activity.js');
var SetActivity = require('./react-native-iOS/set_activity');
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
      // case "webActivity":
      //   Component = WebActivity;
    }
    // console.log("render Scen ")
    return <Component navigator = { navigator } />
},

  // componentDidMount() {
  //     var navigator = this._navigator;
  //     BackAndroid.addEventListener('hardwareBackPress', function() {
  //         if (navigator && navigator.getCurrentRoutes().length > 1) {
  //           navigator.pop();
  //           return true;
  //         }
  //         return false;
  //     });
  // },

  // componentWillUnmount() {
  //   BackAndroid.removeEventListener('hardwareBackPress');
  // },

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