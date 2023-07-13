import { UI_tipPrefabBinding } from "../bindings/UI_tipPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Calculator } from "./Calculator";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { UnitBehaviour } from "./UnitBehaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { generateTip } from "./Tip";

export class UI_UnitActButton extends Behaviour {
    targetProvinceObj: GameObject;
    unitToDestroy: GameObject;
    nation: Nation;
    colonyCost;

    onStart(): void {
    }

    onUpdate(): void {
        this.nation = Nation.nations[this.unitToDestroy.getBehaviour(UnitBehaviour).unitParam.nationId];
        const provinceBehaviour = this.targetProvinceObj.getBehaviour(Province);
        this.colonyCost = Calculator.calculateColonyCost(this.nation.nationId, provinceBehaviour.coord);

        //更新按钮文本
        switch (this.unitToDestroy.getBehaviour(UnitBehaviour).unitParam.name) {
            case "开拓者":
                getGameObjectById("UnitBehaviourText").getBehaviour(TextRenderer).text = "开拓 ||（" + this.colonyCost + "金币）";
                break;
            case "筑城者":
                getGameObjectById("UnitBehaviourText").getBehaviour(TextRenderer).text = "筑城 ||（" + this.colonyCost + "金币）";
                break;
        }

        this.gameObject.onMouseLeftDown = () => {
            this.unitToDestroy.getBehaviour(UnitBehaviour).act(); 
        }
    }
}

