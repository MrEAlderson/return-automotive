<video src="Recording.mp4" width="320" height="240" controls></video>
Run Automotive OS apps on a regular Android. Goal: Benefit from simplified UIs, use any device as a head unit within your car.

## Status
Proof of concept. Still runs within Frida's development environment, although it can be turned production-ready by utilizing Frida's Gadgets.

## Functionality
As you might have already expected, AAOS actually isn't that much different than regular Android, apart from the libraries it includes for Apps to obtain information regarding the car, etc.
The core for (music, media, ...) apps is the preinstalled app "com.android.car.media", which handles rendering and general communication between user apps and the system. This project attempts to hijack the prior-named app by injecting code necessary to override the AAOS-library calls in a manner so that the app may run on regular Android. Fortunately, the app is already prefilled with stubs of the AAOS-library, so you basically just have to go error by error and fill the methods with working alternative logic.

## Setting it up
As explained earlier, this project already implements fundamentals, and has the potential to be easily installable on devices (that are maybe not even rooted?). But as of today, this is what you gotta do to get it running:

Installation
- I am using a virtual/emulated device within Android Studio to test it. Tested with Android 13, make sure to *not* install a device image with "Google Play Store" services. "Google APIs" work fine
- Root it with `adb root`
- Create a new temporary AAOS-device. Obtain the neccessary app using `adb pull /system/priv-app/AAECarMediaApp/AAECarMediaApp.apk` and install it on your regular Android device. You don't need the AAOS-device no longer
- Copy over and run the frida server on the device [tutorial](https://frida.re/docs/android/)
- Install the media app you want to test it with. Must be the AAOS variant! We use [Spotify](https://www.apkmirror.com/apk/spotify-ab/spotify-music-and-podcasts-android-automotive/)

Running it
- Make sure the frida device service is running. Helpful command: `adb shell "/data/local/tmp/frida-server"`
- Clone the project, install NPM, run `npm upgrade` within the project
- In on terminal run `npm run watch` (auto-compiler), and in another `npm run spawn` (server for frida to communicate with)
- You might have to run `npm run spawn` again after doing changes or closing the app
- Run the following command to launch the media app (replace the parameters if you use any other media app than Spotify)
`adb shell am start -n com.android.car.media/com.android.car.media.MediaDispatcherActivity -a android.car.intent.action.MEDIA_TEMPLATE --es android.car.intent.extra.MEDIA_COMPONENT com.spotify.music/com.spotify.automotive.mediabrowserservice.AutomotiveMediaBrowserService`
