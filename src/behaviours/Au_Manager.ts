import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Au_Manager extends Behaviour {
    audioList: { [key: string]: AudioClip } = {};
    currentBackgroundMusic: AudioClip | undefined;

    onStart(): void {
        this.audioList = this.gameObject.getAudioClips();
    }
}
