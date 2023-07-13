import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { UI_selectedProvinceInfoPrefabBinding } from "../bindings/UI_selectedProvinceInfoPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { Province } from "./Province";
import { UnitBehaviour, } from "./UnitBehaviour";
import { UI_UnitActButton } from "./UI_UnitActButton";
import { build } from "vite";
import { UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { UI_BuildButton } from "./UI_BuildButton";
import { Building } from "./Building";
import { Nation } from "./Nation";
import { UI_UpdateSelectedObjInfo } from "./UI_UpdateSelectedObjInfo";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { GameProcess } from "./GameProcess";
import { Au_UnitActButton } from "./Au_UnitActButton";

export class SelectedObjectInfoMangaer extends Behaviour {
    static selectedBehaviour: Behaviour;
    static selectedInfoWindow: GameObject;
    static showSelectedObjectInfo(selectedBehaviour: Behaviour): void {
        //删除旧Info界面
        if (getGameObjectById("UI_selectedProvinceInfo")) {
            getGameObjectById("UI_selectedProvinceInfo").destroy();
        }
        if (getGameObjectById("UI_selectedUnitInfo")) {
            getGameObjectById("UI_selectedUnitInfo").destroy();
        }

        //设置当前选中项
        SelectedObjectInfoMangaer.selectedBehaviour = selectedBehaviour;
        //新建新Info界面
        if (selectedBehaviour instanceof Province) {
            const province = selectedBehaviour as Province;
            const infoPrefab = selectedBehaviour.engine.createPrefab(new UI_selectedProvinceInfoPrefabBinding);
            infoPrefab.getBehaviour(UI_UpdateSelectedObjInfo).selectedBehaviour = province;
            getGameObjectById("uiRoot").addChild(infoPrefab);
            this.selectedInfoWindow = infoPrefab;

        }
        else if (selectedBehaviour instanceof UnitBehaviour) {
            const unit = selectedBehaviour as UnitBehaviour;
            const infoPrefab = selectedBehaviour.engine.createPrefab(new UI_selectedUnitInfoPrefabBinding);
            infoPrefab.getBehaviour(UI_UpdateSelectedObjInfo).selectedBehaviour = unit;
            getGameObjectById("uiRoot").addChild(infoPrefab);
            this.selectedInfoWindow = infoPrefab;

            const unitBehaviourButton = getGameObjectById("UI_UnitBehaviourButton");
            unitBehaviourButton.getBehaviour(UI_UnitActButton).targetProvinceObj =
                Province.provincesObj[selectedBehaviour.unitCoor.x][selectedBehaviour.unitCoor.y];
            unitBehaviourButton.getBehaviour(UI_UnitActButton).unitToDestroy = selectedBehaviour.gameObject;
            unitBehaviourButton.getBehaviour(Au_UnitActButton).unitToDestroy = selectedBehaviour.gameObject;

        }
    }
}
