import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { ColonialProvinces } from "./ColonialProvinces";
import { Province } from "./Province";

export class UI_ColonyButton extends Behaviour {
    provinceToColony: GameObject;
    unitToDestroy: GameObject;
    static provinceList = new ColonialProvinces();

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("colonyButton is clicked")
            this.provinceToColony.getBehaviour(Province).changeNationId(1);
            if(this.provinceToColony.getBehaviour(Province).nationId == 1){
                UI_ColonyButton.provinceList.addPlayerProvince(this.provinceToColony);
            }
            console.log("Colony finish")
            this.unitToDestroy.destroy();
            getGameObjectById("UI_selectedUnitInfo").destroy();
        }
    }
}
