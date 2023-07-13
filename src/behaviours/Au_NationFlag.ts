import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";

export class Au_NationFlag extends Behaviour {
    onStart(): void {
        const audios = getGameObjectById('AudioManager').getAudioClips();
        this.gameObject.onMouseEnterList.push(() => {
            audios['按钮进入音效'].play();   // 鼠标进入时播放音效
        })
        this.gameObject.onMouseLeftDownList.push(() => {
            audios['国家选择音效'].play();   // 鼠标按下时播放音效
        })
    }
}
