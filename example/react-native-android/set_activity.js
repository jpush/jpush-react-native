'use strict'

import React from 'react';
import ReactNative from 'react-native';
const {
	BackAndroid,
	Text,
	View,
	TextInput,
	TouchableHighlight,
	NativeModules,
	StyleSheet
} = ReactNative;
import JPushModule from 'jpush-react-native';

export default class SetActivity extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			tag: '',
			alias: '',
		}

		this.setTag = this.setTag.bind(this);
		this.setAlias = this.setAlias.bind(this);
		this.setBaseStyle = this.setBaseStyle.bind(this);
		this.setCustomStyle = this.setCustomStyle.bind(this);
	}

	componentDidMount() {
		BackAndroid.addEventListener('hardwareBackPress', () => {
			const navigator = this.props.navigator;
			if (navigator.getCurrentRoutes().length > 1) {
				navigator.pop();
				return true;
			}
			return false;
		});
	}

	componentWillUnmount() {
		BackAndroid.removeEventListener('hardwareBackPress');
	}

	setTag() {
		if (this.state.tag !== undefined) {
			/*
			 * 请注意这个接口要传一个数组过去，这里只是个简单的示范
			 */
			JPushModule.setTags(this.state.tag.split(","), (map) => {
				if (map.errorCode === 0) {
					console.log("Tag operate succeed, tags: " + map.tags);
				} else {
					console.log("error code: " + map.errorCode);
				}
			});
		}
	}

	addTag = () => {
		console.log("Adding tag: " + this.state.tag);
		JPushModule.addTags(this.state.tag.split(","), (map) => {
			if (map.errorCode === 0) {
				console.log("Add tags succeed, tags: " + map.tags);
			} else {
				console.log("Add tags failed, error code: " + map.errorCode);
			}
		});
	}

	deleteTags = () => {
		console.log("Deleting tag: " + this.state.tag);
		JPushModule.deleteTags(this.state.tag.split(","), (map) => {
			if (map.errorCode === 0) {
				console.log("Delete tags succeed, tags: " + map.tags);
			} else {
				console.log("Delete tags failed, error code: " + map.errorCode);
			}
		});
	}

	checkTag = () => {
		console.log("Checking tag bind state, tag: " + this.state.tag);
		JPushModule.checkTagBindState(this.state.tag, (map) => {
			if (map.errorCode === 0) {
				console.log("Checking tag bind state, tag: " + map.tag + " bindState: " + map.bindState);
			} else {
				console.log("Checking tag bind state failed, error code: " + map.errorCode);
			}
		});
	}

	getAllTags = () => {
		JPushModule.getAllTags((map) => {
			if (map.errorCode === 0) {
				console.log("Get all tags succeed, tags: " + map.tags);
			} else {
				console.log("Get all tags failed, errorCode: " + map.errorCode);
			}
		});
	}

	cleanAllTags = () => {
		JPushModule.cleanAllTags((map) => {
			if (map.errorCode === 0) {
				console.log("Clean all tags succeed");
			} else {
				console.log("Clean all tags failed, errorCode: " + map.errorCode);
			}
		});
	}


	setAlias() {
		if (this.state.alias !== undefined) {
			JPushModule.setAlias(this.state.alias, (map) => {
				if (map.errorCode === 0) {
					console.log("set alias succeed");
				} else {
					console.log("set alias failed, errorCode: " + map.errorCode);
				}
			});
		}
	}

	deleteAlias = () => {
		console.log("Deleting alias");
		JPushModule.deleteAlias((map) => {
			if (map.errorCode === 0) {
				console.log("delete alias succeed");
			} else {
				console.log("delete alias failed, errorCode: " + map.errorCode);
			}
		})
	}

	getAlias = () => {
		JPushModule.getAlias((map) => {
			if (map.errorCode === 0) {
				console.log("Get alias succeed, alias: " + map.alias);
			} else {
				console.log("Get alias failed, errorCode: " + map.errorCode);
			}
		});
	}

	setBaseStyle() {
		JPushModule.setStyleBasic();
	}

	setCustomStyle() {
		JPushModule.setStyleCustom();
	}

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
								placeholder = { 'Tag为大小写字母，数字，下划线，中文，多个 tag 以 , 分割' }
								multiline = { true }
								onChangeText = { (e) => { this.setState({tag: e})} }>
							</TextInput>
							<TouchableHighlight
								style = { styles.btnStyle }
								onPress = { this.setTag }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									设置 Tags
								</Text>
							</TouchableHighlight> 
						</View>
						<View style = { styles.setterContainer }>
							<Text style = { styles.label }>
								Tag: 
							</Text>
							<TextInput style = { styles.tagInput }
								placeholder = { 'Tag为大小写字母，数字，下划线，中文，多个 tag 以 , 分割' }
								multiline = { true }
								onChangeText = { (e) => { this.setState({tag: e})} }>
							</TextInput>
							<TouchableHighlight
								style = { styles.btnStyle }
								onPress = { this.addTag }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									添加 Tag
								</Text>
							</TouchableHighlight> 
						</View>
						<View style = { styles.setterContainer }>
							<Text style = { styles.label }>
								Tag: 
							</Text>
							<TextInput style = { styles.tagInput }
								placeholder = { 'Tag为大小写字母，数字，下划线，中文，多个 tag 以 , 分割' }
								multiline = { true }
								onChangeText = { (e) => { this.setState({tag: e})} }>
							</TextInput>
							<TouchableHighlight
								style = { styles.btnStyle }
								onPress = { this.deleteTags }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									删除 Tags
								</Text>
							</TouchableHighlight> 
						</View>
						<View style = { styles.setterContainer }>
							<Text style = { styles.label }>
								Tag: 
							</Text>
							<TextInput style = { styles.tagInput }
								placeholder = { 'Tag为大小写字母，数字，下划线，中文' }
								multiline = { true }
								onChangeText = { (e) => { this.setState({tag: e})} }>
							</TextInput>
							<TouchableHighlight
								style = { styles.btnStyle }
								onPress = { this.checkTag }
								underlayColor = '#e4083f'
								activeOpacity = { 0.5 }>
								<Text style = { styles.btnText }>
									查询 Tag 绑定状态
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
									设置 Alias
								</Text>
							</TouchableHighlight>
						</View>
						<TouchableHighlight
                    		underlayColor='#0866d9'
                    		activeOpacity={ 0.5 }
                    		style={ styles.bigBtn }
                    		onPress={ this.deleteAlias }>
                    		<Text style={ styles.bigTextStyle }>
                        		Delete alias
                    		</Text>
                    	</TouchableHighlight>
						<TouchableHighlight
                    		underlayColor='#0866d9'
                    		activeOpacity={ 0.5 }
                    		style={ styles.bigBtn }
                    		onPress={ this.getAllTags }>
                    		<Text style={ styles.bigTextStyle }>
                        		Get Tags
                    		</Text>
                		</TouchableHighlight>
                		<TouchableHighlight
                    		underlayColor='#0866d9'
                    		activeOpacity={ 0.5 }
                    		style={ styles.bigBtn }
                    		onPress={ this.getAlias }>
                    		<Text style={ styles.bigTextStyle }>
                        		Get Alias
                    		</Text>
                		</TouchableHighlight>
                		<TouchableHighlight
                    		underlayColor='#0866d9'
                    		activeOpacity={ 0.5 }
                    		style={ styles.bigBtn }
                    		onPress={ this.cleanAllTags }>
                    		<Text style={ styles.bigTextStyle }>
                        		Clean All Tags
                    		</Text>
                		</TouchableHighlight>
					</View>
					<View style = { styles.title }>
						<Text style = { styles.titleText }>
							定制通知栏样式
						</Text>
					</View>
					<View style = { styles.customContainer }>
						<TouchableHighlight
							style = { styles.customBtn }
							onPress = { this.setBaseStyle }
							underlayColor = '#e4083f'
							activeOpacity = { 0.5 }>
							<Text style = { styles.btnText }>
								定制通知栏样式：Basic
							</Text>
						</TouchableHighlight>
						<TouchableHighlight
							style = { styles.customBtn }
							onPress = { this.setCustomStyle }
							underlayColor = '#e4083f'
							activeOpacity = { 0.5 }>
							<Text style = { styles.btnText }>
								定制通知栏样式：Custom
							</Text>
						</TouchableHighlight>
					</View>
				</View>
		);
	}
}

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
	label: {
		width: 40,
		textAlign: 'center'
	},
	tagInput: {
		flex: 1,
		fontSize: 15,
		marginLeft: 5,
		marginRight: 5,
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
	bigBtn: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: '#3e83d7',
		borderRadius: 8,
		backgroundColor: '#3e83d7'
	},
	bigTextStyle: {
		textAlign: 'center',
		fontSize: 25,
		color: '#ffffff'
	},
	btnText: {
		textAlign: 'center',
		fontSize: 12,
	},
	aliasInput: {
		flex: 1,
		fontSize: 15,
		marginLeft: 5,
		marginRight: 5,
		color: '#000000'
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