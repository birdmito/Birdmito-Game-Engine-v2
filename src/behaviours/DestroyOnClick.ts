import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { string } from "../engine/validators/string";

export class DestroyOnClick extends Behaviour {
    @string()
    targetID: string = "";

    onStart(): void {
        this.gameObject.onMouseLeftUp = () => {
            if (this.targetID !== '') {
                console.log("Destroy" + this.targetID)
                getGameObjectById(this.targetID).destroy();
            }
            else {
                console.log("Destroy" + this.targetID)
                this.gameObject.parent.destroy();
            }
        }
    }

    onUpdate(): void {
    }
}
