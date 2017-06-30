## Introduction
This is a capstone project of Master of Engineering program at UCBerkeley. We are aiming to build an ios application that can help patients keep in track of their health condition and more effeciently communicate with their care-giving team. There are multiple main modules of this application:

* Timeline - presents the timeline of things to do
* History - presents a history
* My Care Team
* Medications
* Measurements
* Symptoms
* Resources
* Appointments
* Help

## Resources feature
The Resources tab uses the Dropbox API to programmatically load all folders and files located in a Dropbox folder, shared with Dmitri and Sarah. NOTE: The
resources/index.html displays only folders. Clicking on a folder will take you to resources/show.html view which can be a combination of files and folders. Clicking on a folder will, again, display resources/show.html with contents of the new folder. Clicking on a file will take you to the "download" page where the user can copy the download link or click the Download button to download the file.

Keep this structure in mind when you're adding/modifying files in this directory.

## Editing Symptoms Feature

## Technology stack
* Ruby on Rails web app -
* Mobile app -
* Firebase - available at . Ask dmitriskj@gmail.com for username/password if you don't know.

## Running iOS simulator
You can run the app in an iOS simulator. First, figure out your available options by running `ios-sim showdevicetypes` and then running `ionic run ios --target="iPad-Air" -l -c`

### Issue 1: Simulator loads with a blank screen
Run with `-l -c` flags to ensure you have livereload and console running.

## Running Android simulator
Make sure you have these variables set:
```
ANDROID_HOME=/Applications/adt-bundle-mac-x86_64-20140702/sdk
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_111.jdk/Contents/Home
```

and that you have GenyMotion installed. Run GenyMotion, click Settings, choose
ADB, and click "Use Custom Android SDK Tools" and input
```
/Applications/adt-bundle-mac-x86_64-20140702/sdk
```

Then run GenyMotion device, and then `ionic run android` in console.


## Installing npm
Clear the cache for npm: https://stackoverflow.com/questions/37914824/cordova-not-updating-to-latest-version


## Certificates for Push Notifications
1. Super simple using Android and Firebase
2. iOS is more complicated. Make sure to follow: https://docs.ionic.io/services/profiles/#ios-push-certificate


## Binary deploys to App Store and Play Store
Binary Update: When your app is updated through the app store. Binary Updates are still necessary for binary changes such as changing your Cordova platform version or adding a Cordova plugin or native library.

See for more: https://docs.ionic.io/services/deploy/

## Testing the app

1. Click this link: https://play.google.com/apps/testing/com.onpoint.onpoint
2. (sign in with personal credentials if necessary)
3. Click "BECOME A TESTER"
4. You will be presented with instructions. Click the link to go to app in Play Store.

Use Ionic View for iOS.


## Uploading to Play Store
To generate a new .jks key:
```
keytool -genkey -v -keystore /Users/dmitri/.android/google-play-app-signing.jks -alias GooglePlayAppSigningKey -keyalg RSA -keysize 2048 -validity 10000
```
See: https://docs.ionic.io/services/profiles/#android-app-keystore

or if you're using Android Studio: https://developer.android.com/studio/publish/app-signing.html


### Releasing a single APK
Make sure to release a single APK: http://stackoverflow.com/questions/32535551/building-combined-armv7-x86-apk-after-crosswalk-integration-in-an-ionic-project

### Setting version codes in config.xml
For Android:
```
versionCode = MAJOR * 10000 + MINOR * 100 + PATCH
```
(https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-the-version-code)

For iOS: major.minor.patch
(https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102364)

Then cordova build --release android


### Deep instructions
Instructions: http://ionicframework.com/docs/guide/publishing.html

cordova plugin rm cordova-plugin-console

cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Users/dmitri/.android/release.jks platforms/android/build/outputs/apk/android-release-unsigned.apk DSAndroidKey


/Applications/adt-bundle-mac-x86_64-20140702/sdk/build-tools/25.0.0/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk OnPoint.apk


## Logging in android
Run ./logandroid.sh





## Authors
Angela Hsueh ([angela.hsueh@berkeley.edu](mailto:angela.hsueh@berkeley.edu))  
Bill Kim ([bkim54@berkeley.edu](mailto:bkim54@berkeley.edu))    
Hansen Liu ([hliu@berkeley.edu](mailto:hliu@berkeley.edu))    
Zhuosi Wang ([zhuosi.wang@berkeley.edu](mailto:zhuosi.wang@berkeley.edu))
Dmitri Skjorshammer([dmitriskj@gmail.com](mailto:dmitriskj@gmail.com))  
