import { Behaviour } from "./Behaviour";
import { string } from "./validators/string";
import { number } from "./validators/number";
import { Transform } from "./Transform";
import { VoidExpression } from "ts-morph";

export class LayoutGroup extends Behaviour {
    @string()
    layoutType: 'horizontal' | 'vertical' = 'vertical';
    @number()
    spacing = 100;
    @string()
    numPerLine = undefined;

    onUpdate(): void {
        this.updateChildrenPosition();
    }

    updateChildrenPosition() {
        if (this.layoutType === 'vertical') {
            this.gameObject.children.forEach((child, index) => {
                if(this.numPerLine !== undefined){
                    child.getBehaviour(Transform).y = index%Number(this.numPerLine) * this.spacing;
                    child.getBehaviour(Transform).x = Math.floor(index / Number(this.numPerLine)) * this.spacing;
                }
                else{
                    child.getBehaviour(Transform).y = index * this.spacing;
                }
            });
        } else {
            this.gameObject.children.forEach((child, index) => {
                if(this.numPerLine !== undefined){
                    child.getBehaviour(Transform).x = index%Number(this.numPerLine) * this.spacing;
                    child.getBehaviour(Transform).y = Math.floor(index / Number(this.numPerLine)) * this.spacing;
                }
                else{
                    child.getBehaviour(Transform).x = index * this.spacing;
                }
            });
        }
    }
}
