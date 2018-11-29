* 检查一下 dependencies 中有没有添加 jpush-react-native 及 jcore-react-native 这两个依赖。

> your react native project/android/app/build.gradle

```
...
dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation project(':jpush-react-native')  // 添加 jpush 依赖
    implementation project(':jcore-react-native')  // 添加 jcore 依赖
    implementation "com.facebook.react:react-native:+"  // From node_modules
}
```

* 检查 android 项目下的 settings.gradle 配置有没有包含以下内容：

> settings.gradle

```
include ':app', ':jpush-react-native', ':jcore-react-native'
project(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')
project(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')
```

* 检查一下 app 下的 AndroidManifest 配置，有没有增加 \<meta-data> 部分。

> your react native project/android/app/AndroidManifest.xml

```
    <application
        ...
        <!-- Required . Enable it you can get statistics data with channel -->
        <meta-data android:name="JPUSH_CHANNEL" android:value="${APP_CHANNEL}"/>
        <meta-data android:name="JPUSH_APPKEY" android:value="${JPUSH_APPKEY}"/>

    </application>
```

* 现在重新 sync 一下项目，应该能看到 jpush-react-native 以及 jcore-react-native 作为 android Library 项目导进来了。
