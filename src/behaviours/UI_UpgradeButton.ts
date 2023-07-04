import { UI_governmentWindowPrefabBinding } from "../bindings/UI_GovernmentWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Nation } from "./Nation";

export class UI_UpgradeButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const playerNation = Nation.nationList[1];
            //判断金币数
            if (playerNation.dora >= playerNation.level * 100) {
                playerNation.level++;
                playerNation.dora -= playerNation.level * 100;
            }
            else {
                console.log("金币不足");
            }
        }
    }
}
