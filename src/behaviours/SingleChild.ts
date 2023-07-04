import { Behaviour } from "../engine/Behaviour";

export class SingleChild extends Behaviour {
    //该Behaviour保证挂载的gameObject下的子物体数量不大于1
    onUpdate(): void {
        if (this.gameObject.children.length > 1) {
            console.log("SingleChild: " + this.gameObject.id + " has more than one child, deleting all children except the first one");
            this.gameObject.children[1].destroy();
            console.log('删除后物体信息：' + this.gameObject.children)
        }
    }
}
