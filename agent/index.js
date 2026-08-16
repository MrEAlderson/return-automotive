import Java from 'frida-java-bridge'
import { log } from "./logger.js"
import { car } from './classes/car.js';
import { carMediaManagerHelper } from './classes/carMediaManagerHelper.js';
import { carUxRestrictions } from './classes/carUxRestrictions.js';
import { carUi } from './classes/carUi.js';
import { activities } from './classes/activities.js';
import { androidAuto } from './classes/auto.js';

const identifyClassLoader = (callback) => {
    Java.enumerateClassLoaders({
        onMatch: function (loader) {
            try {
                // Try to find a class we know belongs to the app, not the Android framework
                if (loader.findClass("com.android.car.ui.recyclerview.CarUiRecyclerViewImpl")) {
                    callback(Java.ClassFactory.get(loader));
                    Java.classFactory.loader = loader;
                }
            } catch (e) {
                // Class not found in this loader, ignore and continue
            }
        },
        onComplete: function () {
        }
    });
};

Java.perform((loader) => {
    try {
        identifyClassLoader((loader) => {
            Java.deoptimizeEverything();
            
            car();
            carMediaManagerHelper();
            carUxRestrictions();
            carUi(loader);
            activities();
            androidAuto();
        });
    } catch (e) {
        log("error: " + e);
    }
});

/*import { log } from "./logger.js";

const header = Memory.alloc(16);
header
    .writeU32(0xdeadbeef).add(4)
    .writeU32(0xd00ff00d).add(4)
    .writeU64(uint64("0x1122334455667788"));
log(hexdump(header.readByteArray(16) as ArrayBuffer, { ansi: true }));

Process.getModuleByName("libSystem.B.dylib")
    .enumerateExports()
    .slice(0, 16)
    .forEach((exp, index) => {
        log(`export ${index}: ${exp.name}`);
    });

Interceptor.attach(Module.findGlobalExportByName("open")!, {
    onEnter(args) {
        const path = args[0].readUtf8String();
        log(`open() path="${path}"`);
    }
});*/
