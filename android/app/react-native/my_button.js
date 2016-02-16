'use strict';

var React = require('react-native');
var ToastAndroid = require('ToastAndroid');

var {
	Text,
	View,
	TouchableNativeFeedback
} = React;

var MyButton = React.createClass({
	onClick: function () {
		ToastAndroid.show('Awesome', ToastAndroid.SHORT);
	},
	render: function () {
	return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Tap me as fast as you can!
          </Text>
          <TouchableNativeFeedback
            onPress={ this.onClick }>
            <View style={styles.buttonStyle}>
              <Text style={styles.buttonText}>
                This is a button
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        );
	},
});

var styles = React.StyleSheet.create({
	container: {
		marginTop: 15,
	},
	buttonStyle: {
	    marginTop: 15,
		padding: 5,
		borderWidth: 1,
		borderColor: '#d4d4d4',

	},
	buttonText: {
		textAlign: 'center',
		fontSize: 25,
		color: '#808080',
	}
});

module.exports = MyButton;
