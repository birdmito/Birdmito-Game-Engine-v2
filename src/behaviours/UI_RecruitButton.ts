import { UI_productWindowPrefabBinding } from "../bindings/UI_buildWindowPrefabBinding";
import { UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Building } from "./Building";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class UI_RecruitButton extends Behaviour {
    onStart(): void {

        this.gameObject.onMouseLeftDown = () => {
            console.log("create recruit window")
            const recruitWindow = this.gameObject.engine.createPrefab(new UI_productWindowPrefabBinding);
            const provinceToRecruit = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).selectedBehaviour as Province;
            for (const unit of provinceToRecruit.recruitableUnitList) {
                const unitUiBinding = new UI_itemPrefabBinding;
                unitUiBinding.itemInfo = unit.getInfo();
                unitUiBinding.itemClickEventText = "招募";
                unitUiBinding.item = unit.name;
                const buildingPrefab = this.gameObject.engine.createPrefab(unitUiBinding);
                recruitWindow.children[1].addChild(buildingPrefab);
            }
            getGameObjectById("ProductWindowRoot").addChild(recruitWindow);
        }
    }

    onUpdate(): void {
    }
}
