import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Au_BattleInfoWindow extends Behaviour { 
    audios: { [key: string]: AudioClip } ={}
    onStart(): void {
        this.audios = getGameObjectById('AudioManager').getAudioClips();
        this.audios['战斗界面音效'].play();
    }
    onEnd(): void {
        this.audios['战斗界面音效'].stop();
    }
}
