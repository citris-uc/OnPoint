## Introduction
This is a capstone project of Master of Engineering program at UCBerkeley. We are aiming to build an ios application that can help patients keep in track of their health condition and more effeciently communicate with their care-giving team. There are multiple main modules of this application:

* Timeline - the main timeline of tasks
* History - history view of past (yesterday and before) tasks
* My Care Team - manage care team
* Medications - manage medications and their schedules
* Measurements - manage your measurements
* Symptoms - take symptom questionnaires and do follow-up questionnaires
* Resources - educational resources about your conditions
* Appointments - manage appointments
* Help - Onboarding module

## Technology stack
* Ruby on Rails with AngularJS
* Heroku - managed by Dmitri Skjorshammer
* Firebase - managed by ucb.onpoint@gmail.com
* Ionic Cloud - managed by ucb.onpoint@gmail.com
* Dropbox API - managed by ucb.onpoint@gmail.com

Ask dmitriskj@gmail.com for specific passwords.

## Ruby on Rails (Heroku web app)
The Rails app lives in a separate repo (`OnPoint-web`) and is primarily
used in cases where direct access to Firebase does not make sense.

To get the app up and running, you will need a `config/application.yml` file.
Because it contains sensitive information, this file is not in the git history.
Ask Dmitri to share with you.

Once you've added the file, run `bundle install && bundle exec foreman start`.

The production web app is available at onpointhealth.herokuapp.com, lives on Heroku and is served by the `master` branch of `OnPoint-web` repo. It is managed
by Dmitri (dmitriskj@gmail.com).

## Slack channel
OnPoint team has used Slack in the past. You can access it here: https://onpointucb.slack.com/

---

## Testing the app in development

### Testing iOS
You can run the app in an iOS simulator. First, figure out your available options by running `ios-sim showdevicetypes` and then running `ionic run ios --target="iPad-Air" -l -c`


### Testing Android
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


### Troubleshooting
Issue 1: Simulator loads with a blank screen
Solution: Run with `-l -c` flags to ensure you have livereload and console running.


---

## Releasing the app (for developers)
We currently test OnPoint via Ionic View on iOS and via Google Play Store Alpha Release on Android. You can read about the reasons for this in Testing the App
section.

### Releasing to test in iOS
Make sure to run `gulp production` to set production variables. Then `ionic upload` to upload latest changes to `3c388edd`. Since this app_id is owned
by Dmitri Skjorshammer, you may have to create a new app in `apps.ionic.io`
and then run `ionic link app_id` where app_id is your new app_id.

### Releasing to test in Android
To deploy to Google Play store, you will need to generate a signed .apk file.
I've automated most of this work in the `./android.sh` file. NOTE: that
file makes assumptions that your signing key is named GooglePlayAppSigningKey and your `zipalign` is located at /Applications/adt-bundle-mac-x86_64-20140702/sdk/build-tools/25.0.0/zipalign. Obviously, this will differ for you so change accordingly.

Before you run `./android.sh`, make sure to set Android version in `config.xml` to a +1 version that doesn't conflict with an existing build version. For Android, the [format is usually](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-the-version-code):
```
versionCode = MAJOR * 10000 + MINOR * 100 + PATCH
```

#### How to generate a new signing key
If you're unfamiliar with how to generate a new signing key for Google, run the following command to generate a .jks key:

```
keytool -genkey -v -keystore /Users/dmitri/.android/google-play-app-signing.jks -alias GooglePlayAppSigningKey -keyalg RSA -keysize 2048 -validity 10000
```

I highly recommend you read [Ionic Docs on Android App Keystore](https://docs.ionic.io/services/profiles/#android-app-keystore) and [Android Studio App Signing](https://developer.android.com/studio/publish/app-signing.html)

---

## Testing the app in production

### Testing on iOS (Apple)
To test on the iPhone, you will use Ionic View to load OnPoint binaries within the Ionic View app container.

1. On your smartphone, open up App Store and search for ["Ionic View" app](https://itunes.apple.com/us/app/ionic-view/id849930087?mt=8)

2. Open up Ionic View and login with the credentials for ucb.onpoint@gmail.com Ask Dmitri (dmitriskj@gmail.com) for credentials.

3. You will probably see an empty list. Pull down to refresh. This will display the OnPoint app.

4. OnPoint the app interferes with Ionic View's educational modal. To turn it off, click on Settings in top right and turn off "Show Swipe Info". Return to main screen.

5. Click on OnPoint. Click "Clear App Data" and then "View App".

6. The app will load and ask for your login. Remember, this is now OnPoint’s login. Either login with existing account or create a new one.

### Testing on Android (Google)
Ionic View's Camera package is outdated and does not work in Android > 7.0. I've
raised this issue on their [GitHub page](https://github.com/ionic-team/ionic-view-issues/issues/223) but a fix has not been implemented. For this reason, we will be testing OnPoint as an Alpha Release on Google Play store.

1. Click this link: https://play.google.com/apps/testing/com.onpoint.onpoint
2. (sign in with personal gmail credentials if necessary)
3. Click "BECOME A TESTER"
4. You will be presented with instructions. Click the link to go to app in Play Store.
5. Download the app. The app should now be on your home screen.

---

## Making changes to Resources feature without coding
The Resources tab uses the Dropbox API to programmatically load all folders and files located in the Dropbox folder. This Dropbox folder is associated with OnPoint. Ask Dmitri (dmitriskj@gmail.com) for login credentials.

NOTE: Any changes to `Apps/onpointhealth/resources_within_mobile_app_do_not_delete` folder will affect the Resources tab.

The resources/index.html displays only folders. Clicking on a folder will take you to resources/show.html view which can be a combination of files and folders. Clicking on a folder will, again, display resources/show.html with contents of the new folder. Clicking on a file will take you to the "download" page where the user can copy the download link or click the Download button to download the file. Keep this structure in mind when you're adding/modifying files in this directory.

---

## Making changes to Symptoms feature without coding
If you want to add or remove Symptoms questionnaires without coding, you will need to have access to the GitHub repo. Then, to add a new Symptoms Questionnaire

---

## Authors
Dmitri Skjorshammer([dmitriskj@gmail.com](mailto:dmitriskj@gmail.com))  
Angela Hsueh ([angela.hsueh@berkeley.edu](mailto:angela.hsueh@berkeley.edu))  
Bill Kim ([bkim54@berkeley.edu](mailto:bkim54@berkeley.edu))    
Hansen Liu ([hliu@berkeley.edu](mailto:hliu@berkeley.edu))    
Zhuosi Wang ([zhuosi.wang@berkeley.edu](mailto:zhuosi.wang@berkeley.edu))
