import { UI_buildWindowPrefabBinding } from "../bindings/UI_buildWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { NationManager } from "./NationManager";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class UI_BuildingButton extends Behaviour {
    buildingName: string;
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const selectedObjectInfoManager = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer);
            const eventText = this.gameObject.getBehaviour(TextRenderer).text;
            if (eventText === "建造") {
                const targetBuilding = Province.getBuildingByName(this.buildingName);
                const targetProvince = selectedObjectInfoManager.selectedBehaviour as Province;
                if (NationManager.nationList[1].money >= targetBuilding.cost) {
                    console.log("建造成功");
                    targetProvince.buildingList.push(targetBuilding);
                    NationManager.nationList[1].money -= targetBuilding.cost;
                    selectedObjectInfoManager.updateSelectedProvinceBuildingList();
                }
                else {
                    console.log("金币不足");
                }
            }
            else if (eventText === "拆除") {
                const targetBuilding = Province.getBuildingByName(this.buildingName);
                const targetProvince = selectedObjectInfoManager.selectedBehaviour as Province;
                targetProvince.buildingList.splice(targetProvince.buildingList.indexOf(targetBuilding), 1);
                console.log("拆除成功");
                selectedObjectInfoManager.updateSelectedProvinceBuildingList();
                console.log("获得金币：" + targetBuilding.cost);
                NationManager.nationList[1].money += targetBuilding.cost;
            }
            else if (eventText === '') {
                return;
            }
            else {
                alert("error: UI_BuildingButton.ts 无法识别的按钮文本");
            }
        }
    }
}
