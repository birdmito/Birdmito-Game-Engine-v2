import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";

export class ColonyBehaviour extends Behaviour {
    provinceToColony: GameObject;
    unitToDestroy: GameObject;

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("colonyButton is clicked")
            this.provinceToColony.getBehaviour(Province).changeNationId(1);
            console.log("Colony finish")
            this.unitToDestroy.destroy();
            this.gameObject.destroy();
        }
    }
}
