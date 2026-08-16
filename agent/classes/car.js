import Java from 'frida-java-bridge';

// https://android.googlesource.com/platform/packages/services/Car/+/refs/heads/main/car-lib/src/android/car/media/CarMediaManager.java#174
export function car() {
    const Car = Java.use("android.car.Car");
    const CarMediaManager = Java.use("android.car.media.CarMediaManager");
    const CarMediaManagerInstance = CarMediaManager.$alloc();
    const ArrayList = Java.use("java.util.ArrayList");
    const List = Java.use("java.util.List");
    const Collections = Java.use("java.util.Collections");
    const HashMap = Java.use("java.util.HashMap");
    const JavaObject = Java.use("java.lang.Object");
    const ComponentName = Java.use("android.content.ComponentName");
    const Integer = Java.use("java.lang.Integer");
    const MediaSourceChangedListener = Java.use("android.car.media.CarMediaManager$MediaSourceChangedListener");const Resources = Java.use('android.content.res.Resources');

    // Car.createCar(Context)
    Car.createCar.overload('android.content.Context').implementation = function (context) {
        console.log("[*] Car.createCar");
        return Car.$alloc();
    }

    // Car.createCar(Context, Handler, long, CarServiceLifecycleListener)
    Car.createCar.overload('android.content.Context', 'android.os.Handler', 'long', 'android.car.Car$CarServiceLifecycleListener').implementation = function (context) {
        console.log("[*] Car.createCar");
        return Car.$alloc();
    }

    // Car#getCarManager(String)
    Car.getCarManager.overload('java.lang.String').implementation = function (serviceName) {
        console.log("[*] Car#getCarManager " + serviceName);

        if (serviceName == "car_media")
            return Java.cast(CarMediaManagerInstance, JavaObject);

        return null
    }

    // Car#finalize
    Car.finalize.implementation = function () {
        // TODO
    }

    // Car#disconnect
    Car.disconnect.implementation = function () {
        // TODO
    }


    const MEDIA_SOURCE_MODE_PLAYBACK = 0;
    const MEDIA_SOURCE_MODE_BROWSE = 1;
    const mediaSources = Java.retain(ArrayList.$new()); // index = mode
    const sourceListeners = Java.retain(HashMap.$new());
    const defaultMediaSource = Java.retain(ComponentName.createRelative("com.android.car.radio", ".service.RadioAppService"));

    for (let i = 0; i <= 1; i++) // for all modes
        mediaSources.add(defaultMediaSource);

    const callListeners = (mode, componentName) => {
        let entries = sourceListeners.get(Integer.valueOf(mode));

        if (entries == null)
            return;
        else
            entries = Java.cast(entries, List);

        for (let i = 0; i < entries.size(); i++) {
            let entry = Java.cast(entries.get(i), MediaSourceChangedListener);

            entry.onMediaSourceChanged(componentName);
        }
    };

    // CarMediaManager#addMediaSourceListener(MediaSourceChangedListener, int)
    CarMediaManager.addMediaSourceListener.overload('android.car.media.CarMediaManager$MediaSourceChangedListener', 'int').implementation = function (callback, mode) {
        console.log("[*] CarMediaManager#addMediaSourceListener " + mode);

        let entries = sourceListeners.get(Integer.valueOf(mode));

        if (entries == null) {
            entries = ArrayList.$new();
            sourceListeners.put(Integer.valueOf(mode), entries);
        } else
            entries = Java.cast(entries, List);

        entries.add(callback);
    }

    // CarMediaManager#addMediaSourceListener(MediaSourceChangedListener, int)
    CarMediaManager.getLastMediaSources.overload('int').implementation = function (mode) {
        console.log("[*] CarMediaManager#getLastMediaSources " + mode + " " + mediaSources.get(mode));

        let source = mediaSources.get(mode);

        return Collections.singletonList(source);
    }

    // CarMediaManager#setMediaSource(ComponentName, int)
    CarMediaManager.setMediaSource.overload('android.content.ComponentName', 'int').implementation = function (name, mode) {
        console.log("[*] CarMediaManager#setMediaSource " + mode + " " + name);
        
        // unless set to false with setIndependentPlaybackConfig, this sets for all modes
        mediaSources.set(MEDIA_SOURCE_MODE_PLAYBACK, name);
        callListeners(MEDIA_SOURCE_MODE_PLAYBACK, name);
        mediaSources.set(MEDIA_SOURCE_MODE_BROWSE, name);
        callListeners(MEDIA_SOURCE_MODE_BROWSE, name);
    }

    // CarMediaManager#getMediaSource(int)
    CarMediaManager.getMediaSource.overload('int').implementation = function (mode) {
        console.log("[*] CarMediaManager#getMediaSource " + mode + " " + mediaSources.get(mode));
        return mediaSources.get(mode);
    }

    // Change DPI
    var originalScale = null

    Resources.getDisplayMetrics.implementation = function () {
        let display = this.getDisplayMetrics();
        //console.log("Display: " + display);
        let scaleFactor = 0.7;

        if (originalScale == null || originalScale != display.density.value) {
            display.density.value *= scaleFactor;
            display.scaledDensity.value *= scaleFactor;
            display.xdpi.value *= scaleFactor;
            display.ydpi.value *= scaleFactor;
            display.densityDpi.value = Math.round(display.densityDpi.value * scaleFactor);

            originalScale = display.density.value; // multiple instance fix
        }

        return display;
    }
}