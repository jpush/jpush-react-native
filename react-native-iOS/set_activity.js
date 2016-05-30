'use strict'

var React = require('react-native');
var {
	Text,
	View,
	Alert,
	TextInput,
	TouchableHighlight,
	NativeModules
} = React;
import JPushModule from 'jpush-react-native';

var SetActivity = React.createClass({
	getInitialState() {
		return {
			tag: '',
			alias: '',
		};
	},
	setTag() {
		if (this.state.tag !== undefined) {
			JPushModule.setTags([this.state.tag], () => {
				// Alert.alert('成功', 'tags 成功',[{text: 'OK'}])；
				console.log('success set tag');
			}, () => {
				// Alert.alert('失败','设置alias 失败',[{text:'fail'}]);
				console.log('fail set tag');
			});
		};
	},
	setAlias() {
		if (this.state.alias !== undefined) {
			JPushModule.setAlias(this.state.alias, () => {
				// Alert.alert('成功', '设置alias 成功',[{text: 'OK'}]);
				console.log('success set alias');
			},() => {
				// Alert.alert('失败','设置alias 失败',[{text:'fail'}]);
				console.log('fail set alias');
			});
		};
	},

	render() {
		return (
				<View style = { styles.container }>
					<View style = { styles.title }>
						<Text style = { styles.titleText }>
							设置Tag和Alias
						</Text>
					</View>
					<View style = { styles.cornorBg }>
						<View style = { styles.setterContainer }>
							<Text style = { styles.label }>
								Tag: 
							</Text>
							<TextInput style = { styles.tagInput }
								placeholder = { 'Tag为大小写字母，数字，下划线，中文，多个以逗号分隔' }
								multiline = { true }
								onChangeText = { (e) => { this.setState({tag: e})} }>
							</TextInput>
							<TouchableHighlight
								style = { styles.btnStyle }
								onPress = { this.setTag }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									设置Tag
								</Text>
							</TouchableHighlight> 
						</View>
						<View style = { styles.setterContainer }>
							<Text style = { styles.label }>
								Alias: 
							</Text>
							<TextInput style = { styles.aliasInput }
								placeholder = { 'Alias为大小写字母，数字，下划线' }
								multiline = { true }
								onChangeText = { (e) => { this.setState({alias: e}) }}>
							</TextInput>
							<TouchableHighlight
								style = { styles.btnStyle }
								onPress = { this.setAlias }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									设置Alias
								</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
			);
	},
});

var styles = React.StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,

	},
	title: {
		padding: 10,
		backgroundColor: '#9c9c9c',
	},
	titleText: {
		color: '#000000'
	},
	cornorBg: {
		paddingBottom: 20,
		paddingTop: 20,
		
	},
	setterContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	label: {
		width: 40,
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
	btnStyle: {
		width: 80,
    	marginTop: 10,
   		borderWidth: 1,
    	borderColor: '#3e83d7',
    	borderRadius: 8,
    	backgroundColor: '#3e83d7',
    	padding: 10
  	},
  	btnText: {
    	textAlign: 'center',
    	fontSize: 12,
  	},
  	aliasInput: {
  		flex: 1,
  		marginTop: 10,
  		fontSize: 15,
  		marginLeft: 5,
  		marginRight: 5,
		height: 20,
  		color: '#0000ff'
  	},
  	customContainer: {
  		marginTop: 10,
  		paddingTop: 10,
  		paddingBottom: 10,
  	},
  	customBtn: {
  		flex: 1,
  		justifyContent: 'center',
  		borderWidth: 1,
  		borderColor: '#6f80dc',
  		borderRadius: 8,
  		backgroundColor: '#6f80dc',
  		marginTop: 10,
  		padding: 10
  	}
});

module.exports = SetActivity