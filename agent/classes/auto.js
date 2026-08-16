import Java from 'frida-java-bridge';

export function androidAuto() {

    const PlaybackCardViewModel = Java.use("com.android.car.media.common.ui.PlaybackCardViewModel");
    
    PlaybackCardViewModel.updateHistoryList.implementation = function(list) {
        console.log("[*] PlaybackCardViewModel#updateHistoryList " + list);

        console.log(Java.backtrace());
    }
}