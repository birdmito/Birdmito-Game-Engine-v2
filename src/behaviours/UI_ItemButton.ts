import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Building } from "./Building";
import { Nation } from "./Nation";
import { ProductingItem } from "./ProductingItem";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { UnitParam } from "./UnitParam";
import { UnitBehaviour } from "./UnitBehaviour";
import { generateTip } from "./Tip";

//在ui界面中，根据EventText的不同，实现点击后建造或者拆除等生产队列操作
export class UI_ItemButton extends Behaviour {
    itemName: string;
    idInList: number = 0;
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const selectedObjectInfoManager = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer);
            const eventText = this.gameObject.getBehaviour(TextRenderer).text;
            const targetProvince = selectedObjectInfoManager.selectedBehaviour as Province;
            var originBuilding: Building;
            var originUnitParam: UnitParam;
            if (targetProvince) {
                originBuilding = Building.getProvinceBuildingByName(targetProvince, this.itemName);
                originUnitParam = UnitParam.getProvinceUnitParamByName(targetProvince, this.itemName);
            }

            switch (eventText) {
                case "建造":
                    const newBuilding = Building.copyBuilding(originBuilding);
                    Nation.nations[1].buildBuilding(targetProvince, newBuilding.name);
                    break;
                case "拆除":
                    targetProvince.buildingList.splice(this.idInList, 1);  //从建筑列表中删除
                    targetProvince.updateProvinceProperties();  //拆除建筑时，资源产出减少
                    console.log("拆除成功");
                    console.log("获得金币：" + originBuilding.cost);
                    Nation.nations[1].dora += originBuilding.cost;
                    break;
                case "取消":
                    console.log("取消 is clicked");
                    targetProvince.productQueue.splice(this.idInList, 1);  //从生产列表中删除
                    console.log("取消成功");
                    if (originBuilding) {
                        console.log("获得金币：" + originBuilding.cost);
                        Nation.nations[1].dora += originBuilding.cost;
                    }
                    if (originUnitParam) {
                        console.log("获得金币：" + originUnitParam.cost);
                        Nation.nations[1].dora += originUnitParam.cost;
                    }
                    break;
                case "招募":
                    console.log("招募 is clicked");
                    //向生产队列中push item
                    Nation.nations[1].recruitUnit(targetProvince, this.itemName);
                    break;
                case "研究":
                    console.log("研究 is clicked");
                    //更改当前科技
                    Nation.nations[1].currentTechName = this.itemName;
                    break;
                default:
                    console.log("Item" + this.gameObject.id + ": " + this.itemName + "没有设置点击事件)");
                    return;
            }
        }
    }
}
