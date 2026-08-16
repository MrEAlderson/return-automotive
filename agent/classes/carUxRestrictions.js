import Java from 'frida-java-bridge';

// https://android.googlesource.com/platform/packages/services/Car/+/refs/heads/main/car-lib/src/android/car/drivingstate/CarUxRestrictions.java?autodive=0%2F%2F
export function carUxRestrictions() {

    const CarUxRestrictions = Java.use("android.car.drivingstate.CarUxRestrictions");
    const CarUxRestrictionsBuilder = Java.use("android.car.drivingstate.CarUxRestrictions$Builder");
    const CarUxRestrictionsUtil = Java.use("com.android.car.ui.utils.CarUxRestrictionsUtil");
    const System = Java.use("java.lang.System");
    const instanceMap = new Map(); // memory leak, idk what a better solution would be

    const Builder = Java.registerClass({
        name: "android.car.drivingstate.CarUxRestrictionsBuilderImpl",
        superClass: CarUxRestrictionsBuilder,

        fields: {
            mRequiresDistractionOptimization: "boolean",
            mActiveRestrictions: "int",
            mTimeStamp: "long",
            mMaxStringLength: "int",
            mMaxCumulativeContentItems: "int",
            mMaxContentDepth: "int"
        },

        methods: {
            $init: [{
                returnType: 'void',
                argumentTypes: ['boolean', 'int', 'long'],
                implementation: function (reqOpt, restrictions, time) {
                    console.log("[*] CarUxRestrictions$Builder$init " + reqOpt + " " + restrictions + " " + time);
                    this.mRequiresDistractionOptimization.value = reqOpt;
                    this.mActiveRestrictions.value = restrictions;
                    this.mTimeStamp.value = time;
                    this.mMaxStringLength.value = 120;
                    this.mMaxCumulativeContentItems.value = 21;
                    this.mMaxContentDepth.value = 3;
                }
            }],

            setMaxStringLength: function(length) {
                console.log("[*] CarUxRestrictions$Builder#setMaxStringLength " + length);
                this.mMaxStringLength.value = length;
                return this;
            },

            setMaxCumulativeContentItems: function(number) {
                console.log("[*] CarUxRestrictions$Builder#setMaxCumulativeContentItems " + number);
                this.mMaxCumulativeContentItems.value = number;
                return this;
            },

            setMaxContentDepth: function(depth) {
                console.log("[*] CarUxRestrictions$Builder#setMaxContentDepth " + depth);
                this.mMaxContentDepth.value = depth;
                return this;
            },

            build: [{
                returnType: 'android.car.drivingstate.CarUxRestrictions',
                argumentTypes: [],
                implementation: function() {
                    let instance = CarUxRestrictions.$alloc();
                    let hash = System.identityHashCode(instance);

                    instanceMap.set(hash, {
                        mRequiresDistractionOptimization: this.mRequiresDistractionOptimization.value,
                        mActiveRestrictions: this.mActiveRestrictions.value,
                        mMaxStringLength: this.mMaxStringLength.value,
                        mMaxCumulativeContentItems: this.mMaxCumulativeContentItems.value,
                        mMaxContentDepth: this.mMaxContentDepth.value
                    });
                    console.log(hash);

                    return instance;
                }
            }]
        }
    });

    CarUxRestrictions.getMaxContentDepth.implementation = function() { // int
        console.log("[*] CarUxRestrictions#getMaxContentDepth");
        let hash = System.identityHashCode(this);
        return instanceMap.get(hash).mMaxContentDepth;
    }

    CarUxRestrictions.getMaxCumulativeContentItems.implementation = function() { // int
        console.log("[*] CarUxRestrictions#getMaxCumulativeContentItems");
        let hash = System.identityHashCode(this);
        return instanceMap.get(hash).mMaxCumulativeContentItems;
    }

    CarUxRestrictions.getMaxRestrictedStringLength.implementation = function() { // int
        console.log("[*] CarUxRestrictions#getMaxRestrictedStringLength");
        let hash = System.identityHashCode(this);
        return instanceMap.get(hash).mMaxStringLength;
    }

    CarUxRestrictions.getActiveRestrictions.implementation = function() { // int
        let hash = System.identityHashCode(this);
        console.log("[*] CarUxRestrictions#getActiveRestrictions " + instanceMap.get(hash).mActiveRestrictions);
        return 0; /* disable all restrictions, otherwise you cant log in etc */ //instanceMap.get(hash).mActiveRestrictions;
    }
    
    CarUxRestrictions.isRequiresDistractionOptimization.implementation = function() { // boolean
        console.log("[*] CarUxRestrictions#isRequiresDistractionOptimization");
        let hash = System.identityHashCode(this);
        return instanceMap.get(hash).mRequiresDistractionOptimization;
    }

    /*
    CarUxRestrictions.describeContents.implementation = function() { // int
        
    }

    CarUxRestrictions.writeToParcel.implementation = function(parcel, i) { // int
        
    }

    CarUxRestrictions.toString.implementation = function() { // int
        
    }

    CarUxRestrictions.isSameRestrictions.implementation = function(other) { // int
        
    }*/

    CarUxRestrictionsUtil.getDefaultRestrictions.implementation = function() {
        console.log("[*] CarUxRestrictionsUtil.getDefaultRestrictions");
        return Builder.$new(true, 511, 0).build();
    }

    CarUxRestrictionsUtil.$init.overload("android.content.Context").implementation = function(context) {
        console.log("[*] CarUxRestrictionsUtil$init");

        try {
            this.$init(context);
        } catch (e) {
            // It'd construct the Builder in this case
            let restrictions = Builder.$new(false, 0, 0).build();
            this.mListener.value.onUxRestrictionsChanged(restrictions);
        }
    }
}