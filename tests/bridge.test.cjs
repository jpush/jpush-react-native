const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function load(os, overrides = {}) {
  const calls = [], events = new Map(), subscriptions = new Map();
  const names = ['requestSubscribeChannels', 'requestSubscribeChannel', 'turnOffPush', 'turnOnPush',
    'initCrashHandler', 'stopCrashHandler', 'crashLogON', 'setLiveActivityTokenReportEnabled',
    'registerLiveActivityPushToStartToken', 'registerLiveActivityPushToken'];
  const native = Object.fromEntries(names.map(name => [name, (...args) => { calls.push({name, args}); return undefined; }]));
  Object.assign(native, overrides);
  const react = {NativeModules: {JPushModule: native}, Platform: {OS: os}, DeviceEventEmitter: {
    addListener: (name, callback) => {
      if (!subscriptions.has(name)) subscriptions.set(name, new Set());
      const current = subscriptions.get(name); current.add(callback);
      events.set(name, value => { for (const fn of Array.from(current)) fn(value); });
      return {remove: () => { current.delete(callback); if (!current.size) {subscriptions.delete(name); events.delete(name);} }};
    }
  }};
  const source = fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8')
    .replace(/import\s*\{[\s\S]*?\}\s*from 'react-native'/, "const { DeviceEventEmitter, NativeModules, Platform } = react")
    .replace('export default class JPush', 'module.exports = class JPush');
  const context = {module: {exports: {}}, react};
  vm.runInNewContext(source, context, {filename: 'jpush/index.js'});
  return {JPush: context.module.exports, calls, events};
}
const hasCode = code => error => error.code === code;

test('new subscriptions validate all input boundaries without invoking native', async () => {
  const {JPush, calls} = load('android');
  for (const value of [null, undefined, {}, [], ['a','b','c','d'], [''], [' '], ['a','a'], [1], ['a', null]]) {
    await assert.rejects(JPush.requestSubscribeChannels(value), hasCode('INVALID_ARGUMENT'));
  }
  assert.equal(calls.length, 0);
  await JPush.requestSubscribeChannels(['a', 'b', 'c']);
  assert.equal(calls[0].name, 'requestSubscribeChannels');
  assert.deepEqual(calls[0].args[0], ['a', 'b', 'c']);
});

test('native errors and non-zero business codes remain distinguishable', async () => {
  const {JPush} = load('android', {
    requestSubscribeChannels: () => Promise.reject(Object.assign(new Error('no activity'), {code:'NO_ACTIVITY'})),
    turnOffPush: () => Promise.resolve({code: 104}),
    turnOnPush: () => Promise.resolve({code: 105, dispatched:true})
  });
  await assert.rejects(JPush.requestSubscribeChannels(['a']), hasCode('NO_ACTIVITY'));
  assert.deepEqual(await JPush.turnOffPush(), {code:104});
  assert.deepEqual(await JPush.turnOnPush(), {code:105, dispatched:true});
});

test('concurrent JS calls retain their own native promise results', async () => {
  const replies = [];
  const {JPush} = load('android', {turnOffPush: () => new Promise(resolve => replies.push(resolve))});
  const first = JPush.turnOffPush(), second = JPush.turnOffPush();
  replies[1]({code:22}); replies[0]({code:11});
  assert.deepEqual(await Promise.all([first, second]), [{code:11}, {code:22}]);
});

test('platform-specific APIs reject explicitly and never touch native', async () => {
  const android = load('android'), ios = load('ios'), other = load('windows');
  await assert.rejects(ios.JPush.requestSubscribeChannels(['a']), hasCode('UNSUPPORTED_PLATFORM'));
  assert.throws(() => ios.JPush.stopCrashHandler(), hasCode('UNSUPPORTED_PLATFORM'));
  for (const name of ['setLiveActivityTokenReportEnabled', 'registerLiveActivityPushToken', 'registerLiveActivityPushToStartToken']) {
    await assert.rejects(android.JPush[name](true), hasCode('UNSUPPORTED_PLATFORM'));
  }
  await assert.rejects(other.JPush.turnOffPush(), hasCode('UNSUPPORTED_PLATFORM'));
  await assert.rejects(other.JPush.turnOnPush(), hasCode('UNSUPPORTED_PLATFORM'));
  assert.equal(android.calls.length + ios.calls.length + other.calls.length, 0);
});

test('iOS diagnostic flag accepts true and false only; restore has no invented result code', async () => {
  const {JPush, calls} = load('ios', {turnOnPush: () => Promise.resolve({dispatched:true})});
  for (const value of [0, 1, null, undefined, 'false', {}, []]) {
    await assert.rejects(JPush.setLiveActivityTokenReportEnabled(value), hasCode('INVALID_ARGUMENT'));
  }
  await JPush.setLiveActivityTokenReportEnabled(true);
  await JPush.setLiveActivityTokenReportEnabled(false);
  assert.deepEqual(calls.map(x => x.args[0]), [true, false]);
  const restored = await JPush.turnOnPush();
  assert.equal(restored.dispatched, true);
  assert.equal(Object.hasOwn(restored, 'code'), false);
});

test('LiveActivity supports binding, null unbinding and sequence boundaries without logging tokens', async () => {
  const {JPush, calls} = load('ios');
  for (const [method, key] of [['registerLiveActivityPushToken', 'activityId'], ['registerLiveActivityPushToStartToken', 'activityAttributes']]) {
    for (const sequence of [-2147483648, 2147483647]) {
      await JPush[method]({[key]:'fixture', token:'00aAFf', sequence});
      await JPush[method]({[key]:'fixture', token:null, sequence});
    }
    for (const patch of [{token:''}, {token:'a'}, {token:'0z'}, {token:undefined}, {token:12},
      {sequence:1.5}, {sequence:Infinity}, {sequence:2147483648}, {sequence:-2147483649}, {[key]:' '}]) {
      await assert.rejects(JPush[method]({[key]:'fixture', token:null, sequence:1, ...patch}), hasCode('INVALID_ARGUMENT'));
    }
  }
  assert.equal(calls.length, 8);
  assert.equal(calls[0].args[0].token, '00aAFf');
});

test('legacy2012 and new2013 payloads retain their distinct types and listener removal', () => {
  const {JPush, calls, events} = load('android');
  const observed = [], listener = value => observed.push(value);
  JPush.addCommandEventListener(listener);
  const old = {command:2012, commandExtra:'Bundle[...]', openChannelResult:'[]', platform:1};
  const current = {command:2013, commandExtra:'Bundle[...]', channels:'[{"code":100}]', commandData:{nested:[true, 3, null, {code:100}]}};
  events.get('CommandEvent')(old); events.get('CommandEvent')(current);
  assert.equal(observed[0], old); assert.equal(observed[1], current);
  JPush.requestSubscribeChannel(['legacy']);
  assert.equal(calls.at(-1).name, 'requestSubscribeChannel');
  JPush.removeListener(listener); assert.equal(events.has('CommandEvent'), false);
});

test('crash collection remains opt-in and existing init signature remains void', () => {
  const {JPush, calls} = load('android');
  assert.equal(calls.length, 0);
  assert.equal(JPush.initCrashHandler(), undefined); JPush.stopCrashHandler();
  assert.deepEqual(calls.map(x => x.name), ['initCrashHandler', 'stopCrashHandler']);
  const ios = load('ios'); ios.JPush.initCrashHandler();
  assert.equal(ios.calls[0].name, 'crashLogON');
});

test('missing or stale native module reports rebuild requirement instead of silent success', async () => {
  const {JPush} = load('android', {turnOnPush: undefined});
  await assert.rejects(JPush.turnOnPush(), hasCode('NATIVE_MODULE_UNAVAILABLE'));
});

test('Android VoIP support-status event is preserved, including unknown numeric values', () => {
  const {JPush, events} = load('android');
  const received = [], callback = value => received.push(value);
  JPush.addVoipEventListener(callback);
  const payload = {messageId:'fixture',extraData:null,platform:1,voipSupportStatus:-99};
  events.get('VoipMessageEvent')(payload); assert.equal(received[0], payload);
  JPush.removeListener(callback); assert.equal(events.has('VoipMessageEvent'), false);
  assert.throws(() => JPush.addVoipEventListener(null), hasCode('INVALID_ARGUMENT'));
  assert.throws(() => load('ios').JPush.addVoipEventListener(callback), hasCode('UNSUPPORTED_PLATFORM'));
});

test('same-source VoIP closures retain independent identity and unsubscribe only themselves', () => {
  const {JPush, events} = load('android');
  const first = [], second = [];
  const factory = result => event => result.push(event);
  const a = factory(first), b = factory(second);
  assert.notEqual(a,b); assert.equal(a.toString(),b.toString());
  JPush.addVoipEventListener(a); JPush.addVoipEventListener(b);
  const emit = events.get('VoipMessageEvent');
  emit({voipSupportStatus:1}); assert.equal(first.length,1);assert.equal(second.length,1);
  JPush.removeListener(a);emit({voipSupportStatus:2});
  assert.equal(first.length,1);assert.equal(second.length,2);
  JPush.removeListener(b);emit({voipSupportStatus:3});
  assert.equal(first.length,1);assert.equal(second.length,2);assert.equal(events.has('VoipMessageEvent'),false);
});

test('repeated same-callback VoIP registration is idempotent and unmount removes every handle', () => {
  const {JPush, events} = load('android');const values=[], callback = event=>values.push(event);
  JPush.addVoipEventListener(callback);JPush.addVoipEventListener(callback);
  const emit=events.get('VoipMessageEvent');emit({voipSupportStatus:0});assert.equal(values.length,1);
  JPush.removeListener(callback);emit({voipSupportStatus:1});
  assert.equal(values.length,1);assert.equal(events.has('VoipMessageEvent'),false);
  JPush.removeListener(callback); // Idempotent component cleanup.
});
