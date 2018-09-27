/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react'
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native'

import JPushModule from 'jpush-react-native'

// const receiveCustomMsgEvent = 'receivePushMsg'
// const receiveNotificationEvent = 'receiveNotification'
// const openNotificationEvent = 'openNotification'
// const getRegistrationIdEvent = 'getRegistrationId'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      bg: '#ffffff',
      appkey: 'AppKey',
      imei: 'IMEI',
      package: 'PackageName',
      deviceId: 'DeviceId',
      version: 'Version',
      pushMsg: 'PushMessage',
      registrationId: 'registrationId',
      tag: '',
      alias: ''
    }

    this.onInitPress = this.onInitPress.bind(this)
    this.onStopPress = this.onStopPress.bind(this)
    this.onResumePress = this.onResumePress.bind(this)
    this.onGetRegistrationIdPress = this.onGetRegistrationIdPress.bind(this)
    this.jumpSecondActivity = this.jumpSecondActivity.bind(this)
    this.setTag = this.setTag.bind(this)
    this.setAlias = this.setAlias.bind(this)
    this.setBaseStyle = this.setBaseStyle.bind(this)
    this.setCustomStyle = this.setCustomStyle.bind(this)
  }

  jumpSecondActivity () {
    console.log('jump to SecondActivity')
    // JPushModule.jumpToPushActivityWithParams('SecondActivity', {
    //   hello: 'world'
    // })
    this.props.navigation.navigate('Push')
  }

  onInitPress () {
    JPushModule.initPush()
  }

  onStopPress () {
    JPushModule.stopPush()
    console.log('Stop push press')
  }

  onHasPermission () {
    JPushModule.hasPermission( res => console.log(`onHasPermission ${res}`) )
  }

  onResumePress () {
    JPushModule.resumePush()
    console.log('Resume push press')
  }

  onGetRegistrationIdPress () {
    JPushModule.getRegistrationID(registrationId => {
      this.setState({
        registrationId: registrationId
      })
    })
  }

  setTag () {
    if (this.state.tag) {
      /**
       * 请注意这个接口要传一个数组过去，这里只是个简单的示范
       */
      JPushModule.setTags(this.state.tag.split(','), map => {
        if (map.errorCode === 0) {
          console.log('Tag operate succeed, tags: ' + map.tags)
        } else {
          console.log('error code: ' + map.errorCode)
        }
      })
    }
  }

  addTag = () => {
    console.log('Adding tag: ' + this.state.tag)
    JPushModule.addTags(this.state.tag.split(','), map => {
      if (map.errorCode === 0) {
        console.log('Add tags succeed, tags: ' + map.tags)
      } else {
        console.log('Add tags failed, error code: ' + map.errorCode)
      }
    })
  }

  deleteTags = () => {
    console.log('Deleting tag: ' + this.state.tag)
    JPushModule.deleteTags(this.state.tag.split(','), map => {
      if (map.errorCode === 0) {
        console.log('Delete tags succeed, tags: ' + map.tags)
      } else {
        console.log('Delete tags failed, error code: ' + map.errorCode)
      }
    })
  }

  checkTag = () => {
    console.log('Checking tag bind state, tag: ' + this.state.tag)
    JPushModule.checkTagBindState(this.state.tag, map => {
      if (map.errorCode === 0) {
        console.log(
          'Checking tag bind state, tag: ' +
            map.tag +
            ' bindState: ' +
            map.bindState
        )
      } else {
        console.log(
          'Checking tag bind state failed, error code: ' + map.errorCode
        )
      }
    })
  }

  getAllTags = () => {
    JPushModule.getAllTags(map => {
      if (map.errorCode === 0) {
        console.log('Get all tags succeed, tags: ' + map.tags)
      } else {
        console.log('Get all tags failed, errorCode: ' + map.errorCode)
      }
    })
  }

  cleanAllTags = () => {
    JPushModule.cleanTags(map => {
      if (map.errorCode === 0) {
        console.log('Clean all tags succeed')
      } else {
        console.log('Clean all tags failed, errorCode: ' + map.errorCode)
      }
    })
  }

  setAlias () {
    if (this.state.alias !== undefined) {
      JPushModule.setAlias(this.state.alias, map => {
        if (map.errorCode === 0) {
          console.log('set alias succeed')
        } else {
          console.log('set alias failed, errorCode: ' + map.errorCode)
        }
      })
    }
  }

  deleteAlias = () => {
    console.log('Deleting alias')
    JPushModule.deleteAlias(map => {
      if (map.errorCode === 0) {
        console.log('delete alias succeed')
      } else {
        console.log('delete alias failed, errorCode: ' + map.errorCode)
      }
    })
  }

  getAlias = () => {
    JPushModule.getAlias(map => {
      if (map.errorCode === 0) {
        console.log('Get alias succeed, alias: ' + map.alias)
      } else {
        console.log('Get alias failed, errorCode: ' + map.errorCode)
      }
    })
  }

  setBaseStyle () {
    if (Platform.OS === 'android') {
      JPushModule.setStyleBasic()
    } else {
      Alert.alert('iOS not support this function', '')
    }
  }

  setCustomStyle () {
    if (Platform.OS === 'android') {
      JPushModule.setStyleCustom()
    } else {
      Alert.alert('iOS not support this function', '')
    }
  }

  componentWillMount () {}

  componentDidMount () {
    if (Platform.OS === 'android') {
      JPushModule.initPush()
      JPushModule.getInfo(map => {
        this.setState({
          appkey: map.myAppKey,
          imei: map.myImei,
          package: map.myPackageName,
          deviceId: map.myDeviceId,
          version: map.myVersion
        })
      })
      JPushModule.notifyJSDidLoad(resultCode => {
        if (resultCode === 0) {
        }
      })
    } else {
      JPushModule.setupPush()
    }

    this.receiveCustomMsgListener = map => {
      this.setState({
        pushMsg: map.content
      })
      console.log('extras: ' + map.extras)
    }

    JPushModule.addReceiveCustomMsgListener(this.receiveCustomMsgListener)
    this.receiveNotificationListener = map => {
      console.log('alertContent: ' + map.alertContent)
      console.log('extras: ' + map.extras)
    }
    JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)

    this.openNotificationListener = map => {
      console.log('Opening notification!')
      console.log('map.extra: ' + map.extras)
      this.jumpSecondActivity()
    }
    JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener)

    this.getRegistrationIdListener = registrationId => {
      console.log('Device register succeed, registrationId ' + registrationId)
    }
    JPushModule.addGetRegistrationIdListener(this.getRegistrationIdListener)
  }

  componentWillUnmount () {
    JPushModule.removeReceiveCustomMsgListener(this.receiveCustomMsgListener)
    JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener)
    JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener)
    JPushModule.removeGetRegistrationIdListener(this.getRegistrationIdListener)
    console.log('Will clear all notifications')
    JPushModule.clearAllNotifications()
  }

  render () {
    return (
      <ScrollView style={styles.parent}>
        <Text style={styles.textStyle}>{this.state.appkey}</Text>
        <Text style={styles.textStyle}>{this.state.imei}</Text>
        <Text style={styles.textStyle}>{this.state.package}</Text>
        <Text style={styles.textStyle}>{this.state.deviceId}</Text>
        <Text style={styles.textStyle}>{this.state.version}</Text>
        <TouchableHighlight
          underlayColor='#0866d9'
          activeOpacity={0.5}
          style={styles.btnStyle}
          onPress={this.onInitPress}
        >
          <Text style={styles.btnTextStyle}>INITPUSH</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#e4083f'
          activeOpacity={0.5}
          style={styles.btnStyle}
          onPress={this.onStopPress}
        >
          <Text style={styles.btnTextStyle}>STOPPUSH</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#e4083f'
          activeOpacity={0.5}
          style={styles.btnStyle}
          onPress={this.onHasPermission}
        >
          <Text style={styles.btnTextStyle}>HasPermission</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#f5a402'
          activeOpacity={0.5}
          style={styles.btnStyle}
          onPress={this.onResumePress}
        >
          <Text style={styles.btnTextStyle}>RESUMEPUSH</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#f5a402'
          activeOpacity={0.5}
          style={styles.btnStyle}
          onPress={this.onGetRegistrationIdPress}
        >
          <Text style={styles.btnTextStyle}>GET REGISTRATIONID</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#f5a402'
          activeOpacity={0.5}
          style={styles.btnStyle}
          onPress={this.jumpSecondActivity}
        >
          <Text style={styles.btnTextStyle}>Go to SecondActivity</Text>
        </TouchableHighlight>
        <Text style={styles.textStyle}>{this.state.pushMsg}</Text>
        <Text style={styles.textStyle}>{this.state.registrationId}</Text>
        <View style={styles.title}>
          <Text style={styles.titleText}>设置Tag和Alias</Text>
        </View>
        <View style={styles.cornorBg}>
          <View style={styles.setterContainer}>
            <Text style={styles.label}>Tag:</Text>
            <TextInput
              style={styles.tagInput}
              placeholder={
                'Tag为大小写字母，数字，下划线，中文，多个 tag 以 , 分割'
              }
              multiline
              onChangeText={e => {
                this.setState({ tag: e })
              }}
            />
            <TouchableHighlight
              style={styles.setBtnStyle}
              onPress={this.setTag}
              underlayColor='#e4083f'
              activeOpacity={0.5}
            >
              <Text style={styles.btnText}>设置 Tags</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.setterContainer}>
            <Text style={styles.label}>Tag:</Text>
            <TextInput
              style={styles.tagInput}
              placeholder={
                'Tag为大小写字母，数字，下划线，中文，多个 tag 以 , 分割'
              }
              multiline
              onChangeText={e => {
                this.setState({ tag: e })
              }}
            />
            <TouchableHighlight
              style={styles.setBtnStyle}
              onPress={this.addTag}
              underlayColor='#e4083f'
              activeOpacity={0.5}
            >
              <Text style={styles.btnText}>添加 Tag</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.setterContainer}>
            <Text style={styles.label}>Tag:</Text>
            <TextInput
              style={styles.tagInput}
              placeholder={
                'Tag为大小写字母，数字，下划线，中文，多个 tag 以 , 分割'
              }
              multiline
              onChangeText={e => {
                this.setState({ tag: e })
              }}
            />
            <TouchableHighlight
              style={styles.setBtnStyle}
              onPress={this.deleteTags}
              underlayColor='#e4083f'
              activeOpacity={0.5}
            >
              <Text style={styles.btnText}>删除 Tags</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.setterContainer}>
            <Text style={styles.label}>Tag:</Text>
            <TextInput
              style={styles.tagInput}
              placeholder={'Tag为大小写字母，数字，下划线，中文'}
              multiline
              onChangeText={e => {
                this.setState({ tag: e })
              }}
            />
            <TouchableHighlight
              style={styles.setBtnStyle}
              onPress={this.checkTag}
              underlayColor='#e4083f'
              activeOpacity={0.5}
            >
              <Text style={styles.btnText}>查询 Tag 绑定状态</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.setterContainer}>
            <Text style={styles.label}>Alias:</Text>
            <TextInput
              style={styles.aliasInput}
              placeholder={'Alias为大小写字母，数字，下划线'}
              multiline
              onChangeText={e => {
                this.setState({ alias: e })
              }}
            />
            <TouchableHighlight
              style={styles.setBtnStyle}
              onPress={this.setAlias}
              underlayColor='#e4083f'
              activeOpacity={0.5}
            >
              <Text style={styles.btnText}>设置 Alias</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight
            underlayColor='#0866d9'
            activeOpacity={0.5}
            style={styles.bigBtn}
            onPress={this.deleteAlias}
          >
            <Text style={styles.bigTextStyle}>Delete alias</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='#0866d9'
            activeOpacity={0.5}
            style={styles.bigBtn}
            onPress={this.getAllTags}
          >
            <Text style={styles.bigTextStyle}>Get Tags</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='#0866d9'
            activeOpacity={0.5}
            style={styles.bigBtn}
            onPress={this.getAlias}
          >
            <Text style={styles.bigTextStyle}>Get Alias</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='#0866d9'
            activeOpacity={0.5}
            style={styles.bigBtn}
            onPress={this.cleanAllTags}
          >
            <Text style={styles.bigTextStyle}>Clean Tags</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>定制通知栏样式</Text>
        </View>
        <View style={styles.customContainer}>
          <TouchableHighlight
            style={styles.customBtn}
            onPress={this.setBaseStyle}
            underlayColor='#e4083f'
            activeOpacity={0.5}
          >
            <Text style={styles.btnText}>定制通知栏样式：Basic</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.customBtn}
            onPress={this.setCustomStyle}
            underlayColor='#e4083f'
            activeOpacity={0.5}
          >
            <Text style={styles.btnText}>定制通知栏样式：Custom</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    )
  }
}

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
    borderWidth: 1
  },
  title: {
    padding: 10,
    backgroundColor: '#9c9c9c'
  },
  titleText: {
    color: '#000000'
  },
  cornorBg: {
    paddingBottom: 20,
    paddingTop: 20
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
  setBtnStyle: {
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
    fontSize: 12
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
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10
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
})
