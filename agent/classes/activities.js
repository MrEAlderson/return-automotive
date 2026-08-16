import Java from 'frida-java-bridge';

export function activities() {

    const ViewControllerBase = Java.use("com.android.car.media.ViewControllerBase");
    const ActivityThread = Java.use("android.app.ActivityThread");
    const Intent = Java.use("android.content.Intent");
    const ComponentName = Java.use("android.content.ComponentName");
    const MediaSource = Java.use("com.android.car.media.common.source.MediaSource");
    const AppBarController = Java.use("com.android.car.media.widgets.AppBarController");

    const buildIntent = (pkgName, activityName) => {
        var intent = Intent.$new();
        var component = ComponentName.$new(pkgName, activityName);

        intent.setComponent(component);
        intent.setFlags(0x10000000);

        return intent;
    };

    const runActivity = (pkgName, activityName) => {
        var currentApp = ActivityThread.currentApplication();

        if (currentApp === null) {
            console.log("[-] Could not get current application context. Make sure the app is fully initialized.");
            return;
        }

        var context = currentApp.getApplicationContext();
        var intent = buildIntent(pkgName, activityName);

        console.log("Starting activity: " + activityName);

        try {
            context.startActivity(intent);
            console.log("Activity launched successfully!");
        } catch (e) {
            console.log("Failed to start activity: " + e);
        }
    };
    
    // ViewControllerBase#updateSourcePreferences(MediaBrowserConnector.BrowsingState)
    ViewControllerBase.updateSourcePreferences.implementation = function(browsingState) {
        console.log("[*] ViewControllerBase#updateSourcePreferences " + browsingState);

        // open settings
        //runActivity("com.spotify.music", "com.spotify.automotive.settingspage.SettingsPageActivity");
    };
    
    // When apps-drawer is clicked (open settings instead)
    MediaSource.getSourceSelectorIntent.implementation = function(g0, g1) {
        console.log("[*] MediaSource.getSourceSelectorIntent " + g1);
        return buildIntent("com.spotify.music", "com.spotify.automotive.settingspage.SettingsPageActivity");
    }

    AppBarController.$init.implementation = function(context, report, controller, i, z) {
        console.log("[*] AppBarController$init");

        this.$init(context, report, controller, i, z);

        if (this.mSettings.value == null || this.mAppSelector.value == null)
            return

        console.log(this.mSettings.value);
        this.mSettings.value?.setVisible(false);
        this.mAppSelector.value?.setVisible(true);
    }
}