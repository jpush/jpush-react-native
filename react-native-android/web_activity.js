'use strict'

var React = require('react-native');
var PushActivity = require('./push_activity');
var {
  View,
  TouchableHighlight,
  Text
} = React;

var WebActivity = React.createClass({
  onPressBack() {
        this.props.navigator.pop();
    },

    render: function() {
    var layout =
        <View style = { styles.parent } >

          <TouchableHighlight
              onPress = { this.onPressBack }>
              <View style = { styles.btnStyle }>
                <Text style = { styles.textStyle }>
                  Back to PushActivity
                </Text>
              </View>
            </TouchableHighlight>

          <Text style = { styles.buttonText }>
            This is WebActivity
          </Text>

          <Text style = { styles.buttonText }>
            Replace this content
          </Text>
        </View>
      ;
      return layout;
    },
});

var styles = React.StyleSheet.create({
  parent: {
    padding: 15
  },
   btnStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3e83d7',
    borderRadius: 8,
    backgroundColor: '#3e83d7'
  },
  textStyle: {
    fontSize: 24,
    color: '#dddddd'
  }
});

module.exports = WebActivity;