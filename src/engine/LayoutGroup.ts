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

    onUpdate(): void {
        this.updateChildrenPosition();
    }

    updateChildrenPosition() {
        if (this.layoutType === 'vertical') {
            this.gameObject.children.forEach((child, index) => {
                child.getBehaviour(Transform).y = index * this.spacing;
            });
        } else {
            this.gameObject.children.forEach((child, index) => {
                child.getBehaviour(Transform).x = index * this.spacing;
            });
        }
    }

    clipChildren() {
        this.gameObject.children.forEach(child => {
            
        });
    }
}
