'use strict'

import React from 'react';
import ReactNative from 'react-native';

var PushActivity = require('./push_activity');
const {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  PropTypes,
  requireNativeComponent,
  NativeModules,
  ScrollView,
  DatePickerIOS,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  StyleSheet
} = ReactNative;
import JPushModule from 'jpush-react-native';

var LocalPushActivity = React.createClass({
	getDefaultProps: function () {
    return {
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,

    };
  },

    getInitialState: function() {
      return {
		      	     date: this.props.date,
	timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
			  textContain: '',
			   butonTitle: '',
     };
    },
     onDateChange: function(date) {
     	console.log('the date is change ');
     	console.log(date.toString);
    this.setState({date: date});
  },

  	addLocationNotification() {
  		JPushModule.setLocalNotification(this.state.date, this.state.textContain, 5, 'dfsa', 'dfaas', null, null);

  	},

    render() {
    	return (
    	<ScrollView style = { styles.parent } >
	        <DatePickerIOS
	          date={this.state.date}
	          mode="datetime"
	          onDateChange={this.onDateChange}
	        />

			<View style = {styles.setterContainer }>
				<Text style = { styles.label }>
					通知内容:
				</Text>
				<TextInput style = { styles.tagInput }
					placeholder = { '请输入你的通知内容' }
					multiline = { true }
					onBlur = { this.hideKeyboard }
					onChangeText = { (e) => { this.setState({textContain: e})}}>
				</TextInput>
			</View>

			<View style = { styles.setterContainer }>
				<Text style = { styles.label }>
					通知按钮文字: 
				</Text>
				<TextInput style = { styles.tagInput }
					placeholder = { '请输入按钮文字' }
					multiline = { true }
					onChangeText = { (e) => { this.setState({butonTitle: e})} }
					onBlur = { this.hideKeyboard }>
				</TextInput>
			</View>

			 <TouchableHighlight
              underlayColor = '#0866d9'
              activeOpacity = { 0.5 }
              style = { styles.btnStyle }
              onPress = { this.addLocationNotification }>
                <Text style = { styles.btnTextStyle }>
                  添加本地推送
                </Text>
            </TouchableHighlight>

            <View style = { styles.baseView } >
            </View>
		</ScrollView>
    	)
    }

})

var styles = StyleSheet.create({
	parent: {
	padding: 15,
	backgroundColor: '#f0f1f3'
	},

	textStyle: {
	marginTop: 10,
	textAlign: 'center',
	fontSize: 20,
	color: '#808080'
	},
	
	baseView: {
	height: 400
	},

	btnStyle: {
	marginTop: 10,
	borderWidth: 1,
	borderColor: '#3e83d7',
	borderRadius: 8,
	backgroundColor: '#3e83d7'
	},

	btnTextStyle: {
	textAlign: 'center',
	fontSize: 25,
	color: '#ffffff'
	},

	inputStyle: {
	borderColor: '#48bbec',
	borderWidth: 1,
	},

	setterContainer: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center'
	},
	label: {
	width: 90,
	textAlign: 'center'
	},
	tagInput: {
	flex: 1,
	marginTop: 10,
	fontSize: 15,
	marginLeft: 5,
	marginRight: 5,
	height: 20,
	color: '#000000'
},

});

module.exports = LocalPushActivity