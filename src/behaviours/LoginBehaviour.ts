import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { GameStateBehaviour } from "./GameStateBehaviour";

export class LoginBehaviour extends Behaviour {
    onUpdate() {
        this.gameObject.onMouseLeftDown = () => {
            console.log("game started");
            getGameObjectById("sceneRoot").getBehaviour(GameStateBehaviour).changeGameState(1);
        }
    }
}
