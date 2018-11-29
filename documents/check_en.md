## Android check configuration part

* Check dependencies in build.gradle to see if jpush-react-native and jcore-react-native have been added.

> your react native project/android/app/build.gradle

```
...
dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation project(':jpush-react-native')  // add jpush dependency
    implementation project(':jcore-react-native')  // add jcore dependency
    implementation "com.facebook.react:react-native:+"  // From node_modules
}
```

* Check settings.gradle in your android project, to see if jpush and jcore have been included：

> settings.gradle

```
include ':app', ':jpush-react-native', ':jcore-react-native'
project(':jpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-react-native/android')
project(':jcore-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jcore-react-native/android')
```

* Check AndroidManifest in your module，to see if \<meta-data> part has been added.

> your react native project/android/app/AndroidManifest.xml

```
    <application
        ...
        <!-- Required . Enable it you can get statistics data with channel -->
        <meta-data android:name="JPUSH_CHANNEL" android:value="${APP_CHANNEL}"/>
        <meta-data android:name="JPUSH_APPKEY" android:value="${JPUSH_APPKEY}"/>

    </application>
```

* Now sync project(press sync button in Android Studio)，you should see jpush-react-native and jcore-react-native have been imported in your android project as Android library project.
