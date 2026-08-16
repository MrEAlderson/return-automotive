import Java from 'frida-java-bridge';

export function carUi(loader) {

    const CarUiUtils = Java.use("com.android.car.ui.utils.CarUiUtils");
    const AppCompatViewInflater = Java.use("androidx.appcompat.app.AppCompatViewInflater");
    const CarUiTextViewImpl = Java.use("com.android.car.ui.widget.CarUiTextViewImpl");
    const CarUiRecyclerViewImpl = Java.use("com.android.car.ui.recyclerview.CarUiRecyclerViewImpl");
    const CarUiRecyclerViewNoScrollbar = Java.use("com.android.car.apps.common.CarUiRecyclerViewNoScrollbar");
    var LayoutInflater = Java.use("android.view.LayoutInflater");
    const TextView = Java.use("android.widget.TextView");

    // CarUiUtils.findViewByRefId(View, int)
    /*CarUiUtils.findViewByRefId.overload("android.view.View", "int").implementation = function(view, i) {
        console.log("[*] CarUiUtils.findViewByRefId " + i);
        let view = this.findViewByRefId(view, i);

        if (view == null)
            return view;

        // expects CarUiTextView
        if (view instanceof TextView) {

        }

        return view;
    }*/

    // AppCompatViewInflater#createTextView(Context, AttributeSet)
    /*AppCompatViewInflater.createTextView.implementation = function (context, attributes) {
        console.log("[*] AppCompatViewInflater#createTextView");
        return CarUiTextViewImpl.$new(context, attributes);
    }

    
    AppCompatViewInflater.createView.overload('android.content.Context', 'java.lang.String', 'android.util.AttributeSet').implementation = function (context, name, attributes) {
        console.log("[*] AppCompatViewInflater#createView " + name);
        return this.createView(context, name, attributes);
    }*/

    LayoutInflater.createView.overload('android.content.Context', 'java.lang.String', 'java.lang.String', 'android.util.AttributeSet').implementation = function (context, name, prefix, attrs) {
        //console.log("[*] LayoutInflater#createView " + name + " " + context + " " + attrs);

        switch (name) {
            case "TextView":
                return CarUiTextViewImpl.$new(context, attrs);
            case "com.android.car.ui.recyclerview.CarUiRecyclerView":
                return CarUiRecyclerViewNoScrollbar.$new(context, attrs);
        }
        
        return this.createView(context, name, prefix, attrs);
    };

    /*LayoutInflater.createView.overload('java.lang.String', 'java.lang.String', 'android.util.AttributeSet').implementation = function (name, prefix, attrs) {
        console.log("2 " + name);
        
        return this.createView(name, prefix, attrs);
    };*/

    // 1. Create the interface in Frida's ClassLoader
        /*loader.registerClass({
            name: "com.android.car.ui.plugin.oemapis.recyclerview.LayoutStyleOEMV1",
            methods: {
                getSpanCount: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getLayoutType: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getOrientation: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getReverseLayout: [{ returnType: "boolean", argumentTypes: [], implementation: () => false }]
            }
        });

        // 2. Create the class in Frida's ClassLoader
        loader.registerClass({
            name: "com.android.car.ui.plugin.oemapis.recyclerview.RecyclerViewAttributesOEMV1",
            methods: {
                "$init": [
                    { returnType: "void", argumentTypes: [], implementation: function () { } },
                    { returnType: "void", argumentTypes: ["android.content.Context", "android.util.AttributeSet"], implementation: function (context, attrs) { } }
                ],
                isRotaryScrollEnabled: [{ returnType: "boolean", argumentTypes: [], implementation: () => false }],
                getSize: [{ returnType: "int", argumentTypes: [], implementation: () => -1 }],
                getLayoutStyle: [{ returnType: "com.android.car.ui.plugin.oemapis.recyclerview.LayoutStyleOEMV1", argumentTypes: [], implementation: () => null }],
                getLayoutWidth: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getLayoutHeight: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getMinWidth: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getMinHeight: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getPaddingLeft: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getPaddingRight: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getPaddingTop: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getPaddingBottom: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getMarginLeft: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getMarginRight: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getMarginTop: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getMarginBottom: [{ returnType: "int", argumentTypes: [], implementation: () => 0 }],
                getBackground: [{ returnType: "android.graphics.drawable.Drawable", argumentTypes: [], implementation: () => null }]
            }
        });*/

    /*const MediaBrowserServiceApi = Java.use("androidx.media.MediaBrowserServiceCompat$MediaBrowserServiceApi21");

    MediaBrowserServiceApi.getOnRoot.implementation = function(name, g2, bundle) {
        console.log("[*] MediaBrowserServiceApi#getOnRoot " + name + " " + g2);
        let root = this.getOnRoot(name, g2, bundle);

        return root;
    };
    const MediaBrowserServiceApi2 = Java.use("androidx.media.MediaBrowserServiceCompat$MediaBrowserServiceImplApi21");

    MediaBrowserServiceApi2.getOnRoot.implementation = function(name, g2, bundle) {
        console.log("[*] MediaBrowserServiceApi2#getOnRoot " + name + " " + g2);
        let root = this.getOnRoot(name, g2, bundle);

        return root;
    };
    const MediaBrowserServiceApi3 = Java.use("androidx.media3.session.MediaLibraryServiceLegacyStub");

    MediaBrowserServiceApi3.getOnRoot.implementation = function(name, g2, bundle) {
        console.log("[*] MediaBrowserServiceApi3#getOnRoot " + name + " " + g2);
        let root = this.getOnRoot(name, g2, bundle);

        return root;
    };
    const MediaBrowserServiceApi4 = Java.use("androidx.media3.session.MediaSessionServiceLegacyStub");

    MediaBrowserServiceApi4.getOnRoot.implementation = function(name, g2, bundle) {
        console.log("[*] MediaBrowserServiceApi4#getOnRoot " + name + " " + g2);
        let root = this.getOnRoot(name, g2, bundle);

        return root;
    };*/
}