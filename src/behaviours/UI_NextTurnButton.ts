import { g } from "vitest/dist/types-2b1c412e";
import { colonyPrefabButtonBinding } from "../bindings/ColonyButtonPrefabBinding";
import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { getBehaviourClassByName, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ColonyBehaviour } from "./ColonyBehaviour";
import { GameProcess } from "./GameProcess";
import { MapManager } from "./MapManager";
import { Province } from "./Province";

export class UI_NextTurnButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onClick = () => {
            getGameObjectById("gameProcess").getBehaviour(GameProcess).nextTurn();
            console.log('NextTurnButton is clicked')
        }
    }
}
