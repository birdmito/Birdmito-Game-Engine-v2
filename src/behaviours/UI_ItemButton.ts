import { EmscriptenRegisteredPointer } from "@zhobo63/imgui-ts/src/emscripten";
import { UI_productWindowPrefabBinding } from "../bindings/UI_buildWindowPrefabBinding";
import { UnitPrefabBinding } from "../bindings/UnitPrefabBinding";
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

//在ui界面中，根据EventText的不同，实现点击后建造或者拆除等生产队列操作
export class UI_ItemButton extends Behaviour {
    itemName: string;
    idInList: number = 0;
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const selectedObjectInfoManager = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer);
            const eventText = this.gameObject.getBehaviour(TextRenderer).text;
            const targetProvince = selectedObjectInfoManager.selectedBehaviour as Province;
            const originBuilding = Building.getBuildingByName(this.itemName);
            const originUnitParam = UnitParam.getUnitParamByName(this.itemName);

            switch (eventText) {
                case "建造":
                    const newBuilding = Building.copyBuilding(originBuilding);

                    if (originBuilding.isUniqueInProvince &&
                        (targetProvince.buildingList.some(building => building.name === newBuilding.name) || targetProvince.productQueue.some(item => item.productName === newBuilding.name))) {
                        console.log("建筑" + newBuilding.name + "在同一省份中只能建造一次");
                        return;
                    }

                    if (Nation.nations[1].dora >= newBuilding.cost) {
                        console.log("建造成功");
                        //向生产队列中push item
                        targetProvince.productQueue.push(new ProductingItem(newBuilding.name, newBuilding.productProcessMax, 'building'));
                        Nation.nations[1].dora -= newBuilding.cost;
                    }
                    else {
                        console.log("金币不足");
                    }
                    break;
                case "拆除":
                    targetProvince.buildingList.splice(this.idInList, 1);  //从建筑列表中删除
                    targetProvince.updateProduction();  //拆除建筑时，资源产出减少
                    console.log("拆除成功");
                    console.log("获得金币：" + originBuilding.cost);
                    Nation.nations[1].dora += originBuilding.cost;
                    break;
                case "取消":
                    console.log("取消 is clicked");
                    targetProvince.productQueue.splice(this.idInList, 1);  //从生产列表中删除
                    console.log("取消成功");
                    console.log("获得金币：" + originBuilding.cost);
                    Nation.nations[1].dora += originBuilding.cost;
                    break;
                case "招募":
                    console.log("招募 is clicked");
                    //向生产队列中push item
                    targetProvince.productQueue.push(new ProductingItem(this.itemName, UnitParam.getUnitParamByName(this.itemName).recruitProcessMax, 'unit'));
                    Nation.nations[1].dora -= originUnitParam.cost;
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
