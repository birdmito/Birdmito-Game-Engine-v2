import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcessMgr } from "./GameProcessMgr";
import { Nation } from "./Nation";
import { generateTip } from "./Tip";

export class UI_UpgradeButton extends Behaviour {
    onUpdate(): void {
        getGameObjectById("_GovernmentUpgradeText").getBehaviour(TextRenderer).text = '升级政府：' + Nation.nations[GameProcessMgr.playerNationId].upgradeCost.toString() + "多拉";
        this.gameObject.onMouseLeftDown = () => {
            const playerNation = Nation.nations[GameProcessMgr.playerNationId];
            playerNation.upgrade();
        }
    }
}
