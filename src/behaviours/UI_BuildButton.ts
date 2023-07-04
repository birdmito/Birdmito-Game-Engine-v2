import { UI_productWindowPrefabBinding } from "../bindings/UI_buildWindowPrefabBinding";
import { UI_itemPrefabBinding as UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Building } from "./Building";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class UI_BuildButton extends Behaviour {
    onStart(): void {

        this.gameObject.onMouseLeftDown = () => {
            const buildWindow = this.gameObject.engine.createPrefab(new UI_productWindowPrefabBinding);
            // if (getGameObjectById("UI_productWindow")) {
            //     getGameObjectById("UI_productWindow").destroy();  // 如果已经存在，就销毁
            // }
            const provinceToBuild = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).selectedBehaviour as Province;
            for (const building of provinceToBuild.buildableBuildingList) {
                const buildingUiBinding = new UI_itemPrefabBinding;
                buildingUiBinding.itemInfo = building.getInfo();
                buildingUiBinding.itemClickEventText = "建造";
                buildingUiBinding.item = building.name;
                const buildingPrefab = this.gameObject.engine.createPrefab(buildingUiBinding);
                buildWindow.children[1].addChild(buildingPrefab);
            }
            getGameObjectById("ProductWindowRoot").addChild(buildWindow);
            // this.gameObject.parent.addChild(buildWindow);
        }
    }

    onUpdate(): void {
    }
}