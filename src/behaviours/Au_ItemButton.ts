import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";

export class Au_ItemButton extends Behaviour {
    audios:{[key:string]:AudioClip} = {};
    eventText: string = '';
    onStart(): void {
        this.audios = getGameObjectById('AudioManager').getAudioClips();
        
        this.gameObject.onMouseEnterList.push(() => {
            this.audios['按钮进入音效'].play();   // 鼠标进入时播放音效
        });
        
        switch (this.eventText) {
            case "建造":
                this.gameObject.onMouseLeftDownList.push(() => {
                    this.audios['建造音效'].play();   // 鼠标按下时播放音效
                    this.audios['花钱音效'].play();   // 鼠标按下时播放音效
                });
                break;
            case "拆除":
                this.gameObject.onMouseLeftDownList.push(() => {
                    this.audios['拆除音效'].play();   // 鼠标按下时播放音效
                });
                break;
            case "取消":
                this.gameObject.onMouseLeftDownList.push(() => {
                    this.audios['取消音效'].play();   // 鼠标按下时播放音效
                });
                break;
            case "招募":
                this.gameObject.onMouseLeftDownList.push(() => {
                    this.audios['招募音效'].play();   // 鼠标按下时播放音效
                });
                break;
            case "研究":
                this.gameObject.onMouseLeftDownList.push(() => {
                    this.audios['研究音效'].play();   // 鼠标按下时播放音效
                });
                break;
            default:
                this.gameObject.onMouseLeftDownList.push(() => {
                    this.audios['按钮点击音效'].play();   // 鼠标按下时播放音效
                });
                break;
        }
        
    }

}
