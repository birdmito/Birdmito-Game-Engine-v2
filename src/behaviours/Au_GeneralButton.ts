import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Au_GeneralButton extends Behaviour {

    onStart(): void {
        const audios = getGameObjectById('AudioManager').getAudioClips();
        
        this.gameObject.onMouseEnterList.push(() => {
            audios['按钮进入音效'].play();   // 鼠标进入时播放音效
        });
        
        if(this.gameObject.id == 'StartButton'){
            this.gameObject.onMouseLeftDownList.push(() => {
                audios['开始游戏音效'].play();   // 开始游戏音效
            });
        }
        else{
            this.gameObject.onMouseLeftDownList.push(() => {
                audios['按钮点击音效'].play();   // 鼠标按下时播放音效
            });
        }

    }

    onUpdate(): void {
    }
}
