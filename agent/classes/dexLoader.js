import Java from 'frida-java-bridge';

// 1. Wait for Python to send the 'load_dex' message and the raw binary 'data'
export function dexLoader() {
    try {
        const ActivityThread = Java.use("android.app.ActivityThread");
        let app = ActivityThread.currentApplication();

        // 2. Check if the app is already running
        if (app !== null) {
            writeAndLoadDex(app.getApplicationContext(), data);
        } else {
            // 3. If spawning, wait for the app to initialize
            console.log("[*] App not fully initialized yet. Waiting for Application.onCreate...");

            const Application = Java.use("android.app.Application");
            Application.onCreate.implementation = function () {
                this.onCreate(); // Let the app initialize normally
                writeAndLoadDex(this.getApplicationContext(), data);
            };
        }
    } catch (e) {
        console.log("Error: " + e);
    }
}

// Helper function to write and load the dex
function writeAndLoadDex(context, rawData) {
    try {
        const FileOutputStream = Java.use("java.io.FileOutputStream");
        const dexPath = context.getCacheDir().getAbsolutePath() + "/stubs.dex";

        // Convert JS ArrayBuffer ('rawData') to a Java byte array
        const jsArray = Array.from(new Uint8Array(rawData));
        const javaByteArray = Java.array('byte', jsArray);

        // Write it natively via Java
        const fos = FileOutputStream.$new(dexPath);
        fos.write(javaByteArray);
        fos.close();

        console.log("[*] Dex written to: " + dexPath);

        // Load it into the app
        Java.openClassFile(dexPath).load();
        console.log("[*] Injected Car UI OEM stubs successfully.");
    } catch (err) {
        console.log("[-] Dex Load Error: " + err);
    }
}