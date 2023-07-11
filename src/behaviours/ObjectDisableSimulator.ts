import { GameObject } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";

export class ObjectDisableSimulator extends Behaviour {
    stringList: string[] = []
    //这个Behaviour模拟物体的active变化
    childrenOn(parent: GameObject = this.gameObject): void {
        parent.children.forEach(child => {
            if (child.getBehaviour(TextRenderer)) {
                child.getBehaviour(TextRenderer).text = this.stringList.shift()
            }
            else if (child.getBehaviour(BitmapRenderer)) {
                child.getBehaviour(BitmapRenderer).source = this.stringList.shift()
            }

            this.childrenOn(child)  //递归
        })
    }
    childrenOff(parent: GameObject = this.gameObject): void {
        parent.children.forEach(child => {
            if (child.getBehaviour(TextRenderer)) {
                this.stringList.push(child.getBehaviour(TextRenderer).text)
                child.getBehaviour(TextRenderer).text = ' '
            }
            else if (child.getBehaviour(BitmapRenderer)) {
                this.stringList.push(child.getBehaviour(BitmapRenderer).source)
                child.getBehaviour(BitmapRenderer).source = './assets/images/TESTTransparent.png'
            }

            this.childrenOff(child)  //递归
        })
    }
}
