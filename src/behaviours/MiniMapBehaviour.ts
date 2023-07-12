import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";

export class MiniMapBehaviour extends Behaviour {

    cameraTransorm :Transform = getGameObjectById("CameraRoot").getBehaviour(Transform)

    onStart(): void {
    }

    onUpdate(): void {

        for (let i = 0; i < this.gameObject.children.length; i++) {
            const child = this.gameObject.children[i];
            child.onMouseLeftDown = () => {
                console.log(child.getBehaviour(Transform).x, child.getBehaviour(Transform).y);
                this.cameraTransorm.x = child.getBehaviour(Transform).x;
                this.cameraTransorm.y = child.getBehaviour(Transform).y;
                console.log(this.cameraTransorm.x, this.cameraTransorm.y);
            }
        }

    }
}
