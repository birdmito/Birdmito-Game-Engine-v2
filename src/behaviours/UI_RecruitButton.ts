import { UI_productWindowPrefabBinding } from "../bindings/UI_buildWindowPrefabBinding";
import { UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Building } from "./Building";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Technology } from "./Technology";
import { UI_UpdateItemInfo } from "./UI_UpdateItemInfo";

export class UI_RecruitButton extends Behaviour {
    onStart(): void {

        this.gameObject.onMouseLeftDown = () => {
            console.log("create recruit window")
            const recruitWindow = this.gameObject.engine.createPrefab(new UI_productWindowPrefabBinding);
            const provinceToRecruit = SelectedObjectInfoMangaer.selectedBehaviour as Province;
            for (const unit of provinceToRecruit.recruitableUnitList) {
                if (unit.techRequired !== '') {
                    if (!Technology.isTechCompleted(provinceToRecruit.nationId, unit.techRequired)) {
                        continue;
                    }
                }
                const unitUiBinding = new UI_itemPrefabBinding;
                unitUiBinding.itemClickEventText = "招募";
                unitUiBinding.item = unit.name;
                const buildingPrefab = this.gameObject.engine.createPrefab(unitUiBinding);
                buildingPrefab.getChildById("_ItemInfo").getBehaviour(UI_UpdateItemInfo).province = provinceToRecruit;
                recruitWindow.children[1].addChild(buildingPrefab);
            }
            getGameObjectById("ProductWindowRoot").addChild(recruitWindow);
        }
    }

    onUpdate(): void {
    }
}
