import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Au_GeneralButton extends Behaviour {

    onStart(): void {
        const audios = getGameObjectById('AudioManager').getBehaviours(AudioClip);
        
        this.gameObject.onMouseEnterList.push(() => {
            audios[1].play();   // 鼠标进入时播放音效
        });
        
        if(this.gameObject.id == 'StartButton'){
            this.gameObject.onMouseLeftDownList.push(() => {
                audios[3].play();   // 开始游戏音效
            });
        }
        else{
            this.gameObject.onMouseLeftDownList.push(() => {
                audios[2].play();   // 鼠标按下时播放音效
            });
        }

    }

    onUpdate(): void {
    }
}
