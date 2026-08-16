import Java from 'frida-java-bridge';

export function carMediaManagerHelper() {
    /*const Car = Java.use("android.car.Car");
    const CarMediaManagerHelper = Java.use("com.android.car.media.common.source.CarMediaManagerHelper");
    const InputFactory = Java.use("com.android.car.media.common.source.CarMediaManagerHelper$InputFactory");

    const ImplInputFactory = Java.registerClass({
        name: "com.android.car.media.common.source.CarMediaManagerHelper$ImplInputFactoryXD",
        implements: [InputFactory],

        fields: {
            context: "android.content.Context"
        },

        methods: {
            $init: [{
                returnType: 'void',
                argumentTypes: ['android.content.Context'],
                implementation: function (ctx) {
                    console.log("[*] ImplInputFactory$init");
                    this.context.value = ctx; 
                }
            }],

            getCarApi: function() {
                console.log("[*] InputFactory#getCarApi");
                return Car.createCar(this.context.value);
            },

            getCarMediaManager: [{
                returnType: "android.car.media.CarMediaManager",
                argumentTypes: ['android.car.Car'],
                implementation: function (car) {
                    console.log("[*] InputFactory#getCarMediaManager");
                    return car.getCarMediaManager(Car.CAR_MEDIA_SERVICE.value);
                }
            }],

            getMediaSource: [{
                returnType: "com.android.car.media.common.source.MediaSource",
                argumentTypes: ['android.content.ComponentName'],
                implementation: function (name) { // TODO
                    console.log("[*] InputFactory#getMediaSource");
                    return null;
                }
            }],

            isAudioMediaSource: [{
                returnType: "boolean",
                argumentTypes: ['android.content.ComponentName'],
                implementation: function (name) { // TODO
                    console.log("[*] InputFactory#isAudioMediaSource");
                    return true;
                }
            }]
        }
    });

    // Fix inlining errors
    // CarMediaManagerHelper.CarMediaManagerHelper(Context)
    CarMediaManagerHelper.$init.overload('android.content.Context').implementation = function(context) {
        console.log("[*] CarMediaManagerHelper$init");
        return this.$init(context, ImplInputFactory.$new(context))
    }*/
}