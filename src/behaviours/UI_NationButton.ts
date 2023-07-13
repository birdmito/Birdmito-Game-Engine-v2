import { UI_nationWindowPrefabBinding } from "../bindings/UI_nationWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { UI_UpdateNationInfo } from "./UI_UpdateNationInfo";
import { UnitBehaviour } from "./UnitBehaviour";

export class UI_NationButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const selecetedObj = SelectedObjectInfoMangaer.selectedBehaviour as Province | UnitBehaviour;
            if (selecetedObj.nationId === GameProcess.playerNationId) return;  // 如果选中的是玩家的领地或者单位，就不弹出国家窗口

            console.log("弹出国家窗口")
            if (getGameObjectById("UI_nationWindow")) {
                getGameObjectById("UI_nationWindow").destroy();
            }
            const prefab = this.engine.createPrefab(new UI_nationWindowPrefabBinding);
            getGameObjectById("uiRoot").addChild(prefab);
        }
    }
}
