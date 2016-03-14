'use strict';

var React = require('react-native');
module.exports = React.ToastAndroid;
module.exports = React.PushHelper;
module.exports = React.JSHelper;
var ToastAndroid = require('ToastAndroid');
var PushActivity = require('./push_activity.js');
var SetActivity = require('./set_activity');
var WebActivity = require('./web_activity');
var {
  Text,
  TextInput,
  View,
  Navigator,
  BackAndroid,
  NativeModules
} = React;

var PushDemoApp = React.createClass({
configureScene(route) {
    return Navigator.SceneConfigs.FadeAndroid;
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
      case "webActivity":
        Component = WebActivity;
    }

    return <Component navigator = { navigator } />
},

  componentDidMount() {
      var navigator = this._navigator;
      BackAndroid.addEventListener('hardwareBackPress', function() {
          if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
          }
          return false;
      });
  },

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress');
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

React.AppRegistry.registerComponent('PushDemoApp', () => PushDemoApp);