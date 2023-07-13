import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";

export class Au_Province extends Behaviour {

    onStart(): void {
        const audios = getGameObjectById('AudioManager').getAudioClips();
        this.gameObject.onMouseLeftDownList.push(() => {
            audios['省份选择音效'].play();   // 鼠标按下时播放音效
        })
    }
}
