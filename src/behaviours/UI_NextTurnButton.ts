import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { getBehaviourClassByName, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_UnitActButton } from "./UI_UnitActButton";
import { GameProcessMgr } from "./GameProcessMgr";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { Province } from "./Province";

export class UI_NextTurnButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            GameProcessMgr.nextTurn();
            console.log('NextTurnButton is clicked')
        }
    }
}
