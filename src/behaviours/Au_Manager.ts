import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Au_Manager extends Behaviour {
    onStart(): void {
        const audioClips = this.gameObject.getBehaviours(AudioClip);
    }

    onUpdate(): void {
    }
}
