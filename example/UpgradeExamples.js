import React, {useEffect, useState} from 'react';
import {Button, Platform, Text, View} from 'react-native';
import JPush from 'jpush-react-native';

// All operations are explicit. Supply ActivityKit tokens from the application's own lifecycle;
// never log the tokens or use credentials from a different test application.
export default function UpgradeExamples({activityId, activityAttributes, pushToken, pushToStartToken}) {
  const [status, setStatus] = useState('SDK 6.3.0 upgrade: explicit test actions only');
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const onVoip = event => setStatus(`VoIP native support status: ${event.voipSupportStatus}`);
    JPush.addVoipEventListener(onVoip);
    return () => JPush.removeListener(onVoip);
  }, []);

  const run = async (name, action) => {
    try {
      const result = await action();
      setStatus(`${name}: ${result && typeof result.code === 'number' ? `native code=${result.code}` : 'dispatched'}`);
    } catch (error) { setStatus(`${name}: ${error.code || 'ERROR'}`); }
  };
  return <View>
    <Text>{status}</Text>
    <Button title="turnOffPush (changes test app state)" onPress={() => run('turnOffPush', () => JPush.turnOffPush())}/>
    <Button title="turnOnPush (iOS acknowledges dispatch only)" onPress={() => run('turnOnPush', () => JPush.turnOnPush())}/>
    {Platform.OS === 'android' && <View>
      <Button title="Subscribe cmd2013 (configure approved channel ID first)"
        onPress={() => run('requestSubscribeChannels', () => JPush.requestSubscribeChannels(['YOUR_APPROVED_CHANNEL_ID']))}/>
      <Button title="Enable crash collection explicitly" onPress={() => run('initCrashHandler', () => JPush.initCrashHandler())}/>
      <Button title="Stop crash collection" onPress={() => run('stopCrashHandler', () => JPush.stopCrashHandler())}/>
    </View>}
    {Platform.OS === 'ios' && <View>
      <Button title="Enable Live Activity diagnostic reports" onPress={() => run('diagnostics', () => JPush.setLiveActivityTokenReportEnabled(true))}/>
      <Button title="Disable local diagnostic switch" onPress={() => run('diagnostics', () => JPush.setLiveActivityTokenReportEnabled(false))}/>
      <Button title="Bind ActivityKit push token (iOS16.1+)" disabled={!activityId || !pushToken}
        onPress={() => run('bind token', () => JPush.registerLiveActivityPushToken({activityId,token:pushToken,sequence:1}))}/>
      <Button title="Unbind ended activity token" disabled={!activityId}
        onPress={() => run('unbind token', () => JPush.registerLiveActivityPushToken({activityId,token:null,sequence:2}))}/>
      <Button title="Bind push-to-start token (iOS17.2+)" disabled={!activityAttributes || !pushToStartToken}
        onPress={() => run('bind start token', () => JPush.registerLiveActivityPushToStartToken({activityAttributes,token:pushToStartToken,sequence:3}))}/>
      <Button title="Unbind push-to-start token" disabled={!activityAttributes}
        onPress={() => run('unbind start token', () => JPush.registerLiveActivityPushToStartToken({activityAttributes,token:null,sequence:4}))}/>
    </View>}
  </View>;
}
