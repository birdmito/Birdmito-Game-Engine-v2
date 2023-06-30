import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";

export class UI_ContinueButton extends Behaviour {
    onStart(): void {
    }

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("继续游戏");
            this.gameObject.parent.destroy();
        }
    }
}
