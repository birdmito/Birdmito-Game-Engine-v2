import { UI_settingWindowPrefabBinding } from "../bindings/UI_settingWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { Transform } from "../engine/Transform";

export class UI_SettingButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const settingWindow = this.engine.createPrefab(new UI_settingWindowPrefabBinding())
            getGameObjectById("uiRoot").addChild(settingWindow)
            // this.engine.createPrefab2Children(new UI_settingWindowPrefabBinding(), this.gameObject)
        }
    }
}
