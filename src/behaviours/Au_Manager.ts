import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Au_Manager extends Behaviour {
    audios: AudioClip[] = [];
    isPushed: boolean = false;
    onStart(): void {
        // this.audios = this.gameObject.getBehaviours(AudioClip);
        console.log(this.gameObject.getAudioClips());
    }

    onUpdate(): void {
        // const closeButton = getGameObjectById("Close");
        // if(closeButton) {
        //     if(this.isPushed) return;
        //     closeButton.onMouseLeftDownList.push(() => {
        //         this.audios[4].play();
        //     });
        //     this.isPushed = true;
        //     console.log(closeButton.onMouseLeftDownList);
        // }
        // else{
        //     this.isPushed = false;
        // }
    }
}
