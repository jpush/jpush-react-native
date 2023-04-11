import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import JPush from 'jpush-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    setBtnStyle: {
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7',
        padding: 10
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 25,
        color: '#ffffff'
    }
});

class Button extends React.Component {
    render() {
        return <TouchableHighlight
            onPress={this.props.onPress}
            underlayColor='#e4083f'
            activeOpacity={0.5}
        >
            <View
                style={styles.setBtnStyle}>
                <Text
                    style={styles.textStyle}>
                    {this.props.title}
                </Text>
            </View>
        </TouchableHighlight>
    }
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        JPush.init({"appKey":"4fcc3e237eec4c4fb804ad49","channel":"dev","production":1});
        //连接状态
        this.connectListener = result => {
            console.log("connectListener:" + JSON.stringify(result))
        };
        JPush.addConnectEventListener(this.connectListener);
        //通知回调
        this.notificationListener = result => {
            console.log("notificationListener:" + JSON.stringify(result))
            alert(JSON.stringify(result))
        };
        JPush.addNotificationListener(this.notificationListener);
        //本地通知回调
        this.localNotificationListener = result => {
            console.log("localNotificationListener:" + JSON.stringify(result))
        };
        JPush.addLocalNotificationListener(this.localNotificationListener);
        //自定义消息回调
        this.customMessageListener = result => {
            console.log("customMessageListener:" + JSON.stringify(result))
        };
        JPush.addCustomMessageListener(this.customMessageListener);
        //应用内消息回调
        JPush.pageEnterTo("HomePage") // 进入首页，当页面退出时请调用 JPush.pageLeave('HomePage')
        this.inappMessageListener = result => {
            console.log("inappMessageListener:" + JSON.stringify(result))
            alert(JSON.stringify(result))
        };
        JPush.addInappMessageListener(this.inappMessageListener);
        //tag alias事件回调
        this.tagAliasListener = result => {
            console.log("tagAliasListener:" + JSON.stringify(result))
        };
        JPush.addTagAliasListener(this.tagAliasListener);
        //手机号码事件回调
        this.mobileNumberListener = result => {
            console.log("mobileNumberListener:" + JSON.stringify(result))
        };
        JPush.addMobileNumberListener(this.mobileNumberListener);
    }

    render() {
        return (
            <View style={styles.container}>
                <Button title="setLoggerEnable"
                        onPress={() => JPush.setLoggerEnable(true)
                        }/>

                <Button title="getRegisterID"
                        onPress={() => JPush.getRegistrationID(result =>
                            console.log("registerID:" + JSON.stringify(result))
                        )}/>

                <Button title="设置用户属性"
                        onPress={() => JPush.setProperties({sequence: 1, pros:{2:'b'}})}/>
          {/*<Button title="addTags"
                                  onPress={() => JPush.addTags({sequence: 1, tags: ["1", "2", "3"]})}/>

                          <Button title="updateTags"
                                  onPress={() => JPush.updateTags({sequence: 2, tags: ["4", "5", "6"]})}/>

                          <Button title="deleteTag"
                                  onPress={() => JPush.deleteTag({sequence: 3, tags: ["4", "5", "6"]})}/>

                          <Button title="deleteTags"
                                  onPress={() => JPush.deleteTags({sequence: 4})}/>

                          <Button title="queryTag"
                                  onPress={() => JPush.queryTag({sequence: 4, tag: "1"})}/>

                          <Button title="queryTags"
                                  onPress={() => JPush.queryTags({sequence: 5})}/>

                          <Button title="setAlias"
                                  onPress={() => JPush.setAlias({sequence: 6,alias:"xxx"})}/>

                          <Button title="deleteAlias"
                                  onPress={() => JPush.deleteAlias({sequence: 7})}/>

                          <Button title="queryAlias"
                                  onPress={() => JPush.queryAlias({sequence: 8})}/>

                          <Button title="setMobileNumber"
                                  onPress={() => JPush.setMobileNumber({mobileNumber: "13888888888"})}/>

                          //仅ios
                          <Button title="setBadge"
                                  onPress={() => JPush.setBadge({"badge":1,"appBadge":1})}/>

                          <Button title="initCrashHandler"
                                  onPress={() => JPush.initCrashHandler()}/>

                          <Button title="addLocalNotification"
                                  onPress={() => JPush.addLocalNotification({
                                      messageID: "123456789",
                                      title: "title123",
                                      content: "content123",
                                      extras: {"key123": "value123"}
                                  })}/>

                          <Button title="removeLocalNotification"
                                  onPress={() => JPush.removeLocalNotification({messageID: '123456789'})}/>*/}

            </View>
        );
    }

}
