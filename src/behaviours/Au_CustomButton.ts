import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { string } from "../engine/validators/string";

export class Au_CustomButton extends Behaviour {
    @string()
    enterAudio = '';
    @string()
    clickAudio = '';
    
    onStart(): void {
        const audios = getGameObjectById('AudioManager').getAudioClips();
        
        this.gameObject.onMouseEnterList.push(() => {
            audios[this.enterAudio].play();   // 鼠标进入时播放音效
        });
        
        this.gameObject.onMouseLeftDownList.push(() => {
            audios[this.clickAudio].play();   // 鼠标按下时播放音效
        });
        

    }
}
