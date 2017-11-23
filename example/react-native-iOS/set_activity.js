'use strict'

import React, { Component } from 'react';
import ReactNative from 'react-native';
const {
    Text,
    View,
    Alert,
    TextInput,
    TouchableHighlight,
    NativeModules,
    StyleSheet
} = ReactNative;

import JPushModule from 'jpush-react-native';

export default class SetActivity extends Component {

	constructor(props) {
		super(props);
	
		this.state = {
			tag: '',
			alias: '',
		};	
	  }

	addTag() {
		JPushModule.addTags([this.state.tag], (result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	setAlias() {
		if (this.state.alias !== undefined) {
			JPushModule.setAlias(this.state.alias, () => {
				// console.log('success set alias');
				Alert.alert('success set alias')
			},() => {
				Alert.alert('fail set alias')
				// console.log('fail set alias');
			});
		};
	}

	//static addTags(tags, cb) {
	setTags() {
		JPushModule.setTags(['tag1', 'tag2'], (result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	deleteTags() {
		JPushModule.deleteTags(['tag1', 'tag2'], (result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	cleanTags() {
		JPushModule.cleanTags((result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	getAllTags() {
		JPushModule.getAllTags((result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	checkTagBindState() {
		JPushModule.checkTagBindState('tag1', (result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	deleteAlias() {
		JPushModule.deleteAlias((result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	getAlias() {
		JPushModule.getAlias((result)=> {
			Alert.alert(JSON.stringify(result))
		})
	}

	render() {
		return (
				<View style = { styles.container }>
					<View style = { styles.title }>
						<Text style = { styles.titleText }>
							设置 Tag 和 Alias
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
								onPress = { this.addTag }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									addTag
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
									addAlias
								</Text>
							</TouchableHighlight>
						</View>


						<View style = { styles.setterRowContainer }>
							<TouchableHighlight
								style = { styles.setterBtnStyle }
								onPress = { this.setTags }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									setTags
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style = { styles.setterBtnStyle }
								onPress = { this.cleanTags }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									cleanTags
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style = { styles.setterBtnStyle }
								onPress = { this.getAllTags }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									getAllTags
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								style = { styles.setterBtnStyle }
								onPress = { this.checkTagBindState }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									检查设备是否绑定 tag
								</Text>
							</TouchableHighlight>

							<TouchableHighlight
								style = { styles.setterBtnStyle }
								onPress = { this.deleteAlias }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									deleteAlias
								</Text>
							</TouchableHighlight>
							
							<TouchableHighlight
								style = { styles.setterBtnStyle }
								onPress = { this.getAlias }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									getAlias
								</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
			);
	}
};

var styles = StyleSheet.create({
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
	setterRowContainer: {
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
	setterBtnStyle: {
		width: 180,
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