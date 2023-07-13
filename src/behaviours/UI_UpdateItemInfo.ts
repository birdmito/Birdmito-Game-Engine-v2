import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { Building } from "./Building";
import { Province } from "./Province";
import { Technology } from "./Technology";
import { UnitParam } from "./UnitParam";

export class UI_UpdateItemInfo extends Behaviour {
    province: Province;
    itemName: string;
    indexInQueue: number = -1;

    onUpdate(): void {
        if (Technology.getNationTechByName(1, this.itemName)) {
            const tech = Technology.getNationTechByName(1, this.itemName);
            this.gameObject.getChildById("_ItemInfoText").getBehaviour(TextRenderer).text = tech.getInfo();
        }
        else if (Building.getProvinceBuildingByName(this.province, this.itemName)) {
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

        if (this.indexInQueue !== -1) {
            this.gameObject.parent.getChildById("_ProductProcessText").getBehaviour(TextRenderer).text =
                `${this.province.productQueue[this.indexInQueue].productProcess} / ${this.province.productQueue[this.indexInQueue].productProcessMax}`;
        }

        //更新图标
        const itemButton = this.gameObject.parent.getChildById("_ItemButton");
        switch (this.itemName) {
            case "金矿":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingMine.png'
                break;
            case "兵营":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingArmy.png'
                break;
            case "大学":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingUniversity.png'
                break;
            case "秘源金矿":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingMagicMine.png'
                break;
            case "机械工业厂":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingIndustry.png'
                break;
            case "贸易站":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingTrade.png'
                break;
            case "秘源精炼厂":
                itemButton.getBehaviour(BitmapRenderer).source = './assets/images/Icon_BuildingMagicIndustry.png'
                break;
        }
    }
}
