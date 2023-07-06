import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { getBehaviourClassByName, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_UnitBehaviourButton } from "./UI_UnitBehaviourButton";
import { GameProcess } from "./GameProcess";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { Province } from "./Province";

export class UI_NextTurnButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onClick = () => {
            getGameObjectById("gameProcess").getBehaviour(GameProcess).nextTurn();
            console.log('NextTurnButton is clicked')
        }
    }
}
