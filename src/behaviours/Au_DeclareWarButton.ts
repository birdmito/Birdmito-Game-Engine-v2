import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";

export class Au_DeclareWarButton extends Behaviour { 
    audios: { [key: string]: AudioClip } ={}
    onStart(): void {
        this.audios = getGameObjectById('AudioManager').getAudioClips();
        
        this.gameObject.onMouseEnterList.push(() => {
            this.audios['按钮进入音效'].play();   // 鼠标进入时播放音效
        });
        

        
    }

    onUpdate(): void {
        const state = getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).text

        switch (state) {
            case '议和':
                this.gameObject.onMouseLeftDown = () => {
                    this.audios['议和音效'].play();   // 鼠标按下时播放音效
                }
                break;
            case '宣战':
                this.gameObject.onMouseLeftDown = () => {
                    this.audios['宣战音效'].play();   // 鼠标按下时播放音效
                }
                break;
        }
    }
}
