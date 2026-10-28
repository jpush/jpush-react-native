import JPush, { LiveActivityResult, PushOperationResult, PushRestoreResult, CommandValue } from '..';
import JCore from 'jcore-react-native';
const subscribe: Promise<void> = JPush.requestSubscribeChannels(['fixture']);
const pause: Promise<PushOperationResult> = JPush.turnOffPush();
const restore: Promise<PushRestoreResult> = JPush.turnOnPush();
const diagnostic: Promise<void> = JPush.setLiveActivityTokenReportEnabled(false);
const token: Promise<LiveActivityResult> = JPush.registerLiveActivityPushToken({activityId:'fixture',token:null,sequence:1});
JPush.registerLiveActivityPushToStartToken({activityAttributes:'Fixture',token:'00aa',sequence:2});
JPush.stopCrashHandler();
JPush.addCommandEventListener(event => { const data: CommandValue | undefined = event.commandData; return data; });
JCore.readNewLogs(result => { const logs: string = result.logs; return logs; });
// @ts-expect-error strict boolean contract
JPush.setLiveActivityTokenReportEnabled(1);
// @ts-expect-error explicit null required to unbind
JPush.registerLiveActivityPushToken({activityId:'fixture',sequence:1});
void [subscribe,pause,restore,diagnostic,token];

JPush.addVoipEventListener(event => { const status: number = event.voipSupportStatus; return status; });
