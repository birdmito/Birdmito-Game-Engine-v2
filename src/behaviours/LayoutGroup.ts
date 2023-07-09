import { Behaviour } from "../engine/Behaviour";
import { string } from "../engine/validators/string";
import { number } from "../engine/validators/number";
import { Transform } from "../engine/Transform";
import { VoidExpression } from "ts-morph";
import { Province } from "./Province";

export class LayoutGroup extends Behaviour {
    @string()
    layoutType: 'horizontal' | 'vertical' = 'vertical';
    @string()
    alignment: 'center' = undefined;
    @number()
    spacing = 100;
    @string()
    numPerLine = undefined;


    onUpdate(): void {
        this.updateChildrenPosition();
    }

    updateChildrenPosition() {
        if (this.gameObject.children.length === 0) return;
        if (this.layoutType === 'vertical') {
            this.gameObject.children.forEach((child, index) => {
                if (this.numPerLine !== undefined) {
                    child.getBehaviour(Transform).y = index % Number(this.numPerLine) * this.spacing;
                    child.getBehaviour(Transform).x = Math.floor(index / Number(this.numPerLine)) * this.spacing;
                }
                else {
                    child.getBehaviour(Transform).y = index * this.spacing;
                }
                //根据子物体数量调整所有子物体的位置，使其总体居中
                if (this.alignment === 'center') {
                    const totalHeight = this.gameObject.children.length * this.spacing;
                    const halfHeight = totalHeight / 2;
                    child.getBehaviour(Transform).y -= halfHeight;
                }
            });
        } else {
            this.gameObject.children.forEach((child, index) => {
                if (this.numPerLine !== undefined) {
                    child.getBehaviour(Transform).x = index % Number(this.numPerLine) * this.spacing;
                    child.getBehaviour(Transform).y = Math.floor(index / Number(this.numPerLine)) * this.spacing;
                }
                else {
                    child.getBehaviour(Transform).x = index * this.spacing;
                }
                //根据子物体数量调整所有子物体的位置，使其总体居中
                if (this.alignment === 'center') {
                    console.log("x" + this.gameObject.parent.getBehaviour(Province).coord.x + ' y ' + this.gameObject.parent.getBehaviour(Province).coord.y + ' ' +
                        this.gameObject.parent.getBehaviour(Province).unitList.length + ' '
                        + this.gameObject.children.length)
                    const totalWidth = this.gameObject.children.length * this.spacing;
                    const halfWidth = totalWidth / 2;
                    child.getBehaviour(Transform).x -= halfWidth;
                }
            });
        }
    }
}
