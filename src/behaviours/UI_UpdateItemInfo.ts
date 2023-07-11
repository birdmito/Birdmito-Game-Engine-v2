import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Building } from "./Building";
import { Province } from "./Province";
import { UnitParam } from "./UnitParam";

export class UI_UpdateItemInfo extends Behaviour {
    province: Province;
    itemName: string;

    onStart(): void {
        if (Building.getProvinceBuildingByName(this.province, this.itemName)) {
            const building = Building.getProvinceBuildingByName(this.province, this.itemName);
            this.gameObject.getChildById("_ItemInfoText").getBehaviour(TextRenderer).text = building.getInfo();
        }
        else if (UnitParam.getProvinceUnitParamByName(this.province, this.itemName)) {
            const unit = UnitParam.getProvinceUnitParamByName(this.province, this.itemName);
            this.gameObject.getChildById("_ItemInfoText").getBehaviour(TextRenderer).text = unit.getInfo();
        }
        else {
            console.warn("UI_UpdateItemInfo: 未找到建筑或单位")
        }
    }
}
