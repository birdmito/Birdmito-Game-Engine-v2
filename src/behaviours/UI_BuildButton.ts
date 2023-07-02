import { UI_buildWindowPrefabBinding } from "../bindings/UI_buildWindowPrefabBinding";
import { UI_buildingPrefabBinding } from "../bindings/UI_buildingPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Building } from "./Building";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class UI_BuildButton extends Behaviour {
    onStart(): void {

        this.gameObject.onMouseLeftDown = () => {
            const buildWindow = this.gameObject.engine.createPrefab(new UI_buildWindowPrefabBinding);
            const provinceToBuild = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).selectedBehaviour as Province;
            for (const Building of provinceToBuild.buildableBuildingList) {
                const buildingUiBinding = new UI_buildingPrefabBinding;
                buildingUiBinding.buildingInfo = "建筑名：" + Building.name +
                    "\n建造花费：" + Building.cost + "\n建造回合数：" + Building.buildTime + "\n建筑产出：" + Building.production;
                buildingUiBinding.buildingEventText = "建造";
                buildingUiBinding.buildingName = Building.name;
                const buildingPrefab = this.gameObject.engine.createPrefab(buildingUiBinding);
                buildingPrefab.getBehaviour(Transform).y = 30 + provinceToBuild.buildableBuildingList.indexOf(Building) * 40;
                buildWindow.addChild(buildingPrefab);
            }
            this.gameObject.parent.addChild(buildWindow);
            // getGameObjectById("BuildWindowRoot").addChild(buildWindow);
        }
    }

    onUpdate(): void {
    }
}
