import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { string } from "../engine/validators/string";

export class DestroyOnClick extends Behaviour {
    @string()
    targetID: string = "";
    
    onUpdate(): void {
        this.gameObject.onClick = () => {
            if (this.targetID) {
                getGameObjectById(this.targetID).destroy();
            }
            else {
                this.gameObject.parent.destroy();
            }
        }
    }
}
