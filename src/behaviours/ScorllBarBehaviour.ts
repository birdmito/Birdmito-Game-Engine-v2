import { TextArea } from "@microsoft/fast-components";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";

export class ScrollBarBehaviour extends Behaviour {

    textArea: GameObject
    up: GameObject
    down:GameObject
    container : GameObject
    scrollPosition: number
    scrollOffset: number

    onStart(): void {

        this.container = this.gameObject.getChildById('Background')
        this.textArea = this.gameObject.getChildById('TextArea')
        this.up = this.gameObject.getChildById('ScrollbarUp')
        this.down = this.gameObject.getChildById('ScrollbarDown')
    }

    onUpdate(): void {

        // 监听文本区域的鼠标点击事件
        this.textArea.onMouseLeftDown = () => {
        console.log('TextArea is clicked');
        // 处理文本区域被点击的逻辑
        }

        // 监听滚动条的拖动事件
        this.up.onMouseLeftDown = () => {
            const yOffset = 10; // 调整此值以控制向上移动的距离
            this.textArea.getBehaviour(Transform).y -= yOffset
        }

        this.down.onMouseLeftDown = () =>{
            const yOffset = 10; // 调整此值以控制向上移动的距离
            this.textArea.getBehaviour(Transform).y += yOffset
        }

    }

}