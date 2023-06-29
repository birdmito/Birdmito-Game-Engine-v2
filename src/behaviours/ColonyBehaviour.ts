import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { ProvinceBehaviour } from "./ProvinceBehaviour";

export class ColonyBehaviour extends Behaviour {



    onStart(): void {

    }

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("殖民is clicked")
            getGameObjectById("Province").getBehaviour(ProvinceBehaviour).changeNationId(1);
        }
    }
}
