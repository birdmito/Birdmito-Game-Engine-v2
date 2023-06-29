import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { ProvinceBehaviour } from "./ProvinceBehaviour";

export class ColonyBehaviour extends Behaviour {
    provinceToColony: GameObject;

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("殖民is clicked")
            this.provinceToColony.getBehaviour(ProvinceBehaviour).changeNationId(1);
        }
    }
}
