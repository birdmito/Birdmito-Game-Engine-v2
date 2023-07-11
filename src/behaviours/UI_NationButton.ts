import { UI_nationWindowPrefabBinding } from "../bindings/UI_nationWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { UI_UpdateNationInfo } from "./UI_UpdateNationInfo";

export class UI_NationButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            console.log("弹出国家窗口")
            if (getGameObjectById("UI_nationWindow")) {
                getGameObjectById("UI_nationWindow").destroy();
            }
            const prefab = this.engine.createPrefab(new UI_nationWindowPrefabBinding);
            getGameObjectById("uiRoot").addChild(prefab);
        }
    }
}
