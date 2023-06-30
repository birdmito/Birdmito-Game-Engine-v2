import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { GameStateBehaviour } from "./GameStateBehaviour";

export class UI_ReturnButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("返回主菜单");
            getGameObjectById("sceneRoot").getBehaviour(GameStateBehaviour).changeGameState(0);
        }
    }
}