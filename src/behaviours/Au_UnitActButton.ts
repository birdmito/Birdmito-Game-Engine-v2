import { GameObject, getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";
import { UI_UnitActButton } from "./UI_UnitActButton";
import { UnitBehaviour } from "./UnitBehaviour";

export class Au_UnitActButton extends Behaviour {
    unitToDestroy: GameObject;
    audios: { [key: string]: AudioClip } ={}
    isPushed = false;
    onStart(): void {
        this.audios = getGameObjectById('AudioManager').getAudioClips();
        this.gameObject.onMouseEnterList.push(() => {
            this.audios['按钮进入音效'].play();   // 鼠标进入时播放音效
        });
    }
    onUpdate(): void {
        if(!this.isPushed){
            switch (this.unitToDestroy.getBehaviour(UnitBehaviour).unitParam.name) {
                case "开拓者":
                    this.gameObject.onMouseLeftDownList.push(() => {
                        this.audios['开拓音效'].play();   // 鼠标按下时播放音效
                    });
                    this.isPushed = true;
                    break;
                case "筑城者":
                    this.gameObject.onMouseLeftDownList.push(() => {
                        this.audios['筑城音效'].play();   // 鼠标按下时播放音效
                    });
                    this.isPushed = true;
                    break;
            }
        }
    }
}
