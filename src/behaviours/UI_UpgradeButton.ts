import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Nation } from "./Nation";
import { generateTip } from "./Tip";

export class UI_UpgradeButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.getBehaviour(TextRenderer).text = '升级政府：' + Nation.nations[1].upgradeCost.toString() + "多拉";
        this.gameObject.onMouseLeftDown = () => {
            const playerNation = Nation.nations[1];
            //判断金币数
            if (playerNation.dora >= playerNation.upgradeCost) {
                playerNation.level++;
                playerNation.dora -= playerNation.upgradeCost;
                console.log("升级成功" + playerNation.level);
                playerNation.updateNationProperties();
            }
            else {
                console.log("金币不足");
                generateTip(this, "金币不足");
            }
        }
    }
}
