import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";

export class Au_Province extends Behaviour {
    onStart(): void {
        const audios = getGameObjectById('AudioManager').getAudioClips();
        const province = this.gameObject.parent.getBehaviour(Province)
        this.gameObject.onMouseLeftDownList.push(() => {
            audios['省份选择音效'].play();   // 鼠标按下时播放音效
        })
        console.log(province.isLand)
        if(province.isLand){
            this.gameObject.onMouseRightDownList.push(() => {
                audios['单位移动音效'].play();   // 鼠标按下时播放音效
            })
        }
        else{
            this.gameObject.onMouseRightDownList.push(() => {
                audios['单位不可通行音效'].play();   // 鼠标按下时播放音效
            })
        }

    }
}
