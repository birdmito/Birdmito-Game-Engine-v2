import { UI_StaffWindowPrefabBinding } from "../bindings/UI_StaffWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";

export class UI_StaffButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const StaffWindow = this.engine.createPrefab(new UI_StaffWindowPrefabBinding())
            getGameObjectById("StaffRoot").addChild(StaffWindow)
            //console.log("打开制作人员名单");
        }
    }
}
