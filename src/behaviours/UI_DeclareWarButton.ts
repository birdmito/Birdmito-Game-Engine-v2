import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { generateTip } from "./Tip";
import { UnitBehaviour } from "./UnitBehaviour";

export class UI_DeclareWarButton extends Behaviour {
    nation: Nation
    onStart(): void {
        const selectedObj = SelectedObjectInfoMangaer.selectedBehaviour as Province | UnitBehaviour
        this.nation = Nation.nations[selectedObj.nationId]
    }

    onUpdate(): void {
        // 获取玩家对该国家的态度
        this.gameObject.onMouseLeftDown = () => {
            if (Nation.nations[GameProcess.playerNationId].favorability.get(this.nation.nationId) >= -5) {
                console.log('我们对他们的态度不够恶劣，无法宣战')
                generateTip(this, '我们对他们的态度不够恶劣，无法宣战')
            }
            else {
                Nation.nations[GameProcess.playerNationId].declareWar(this.nation)
                console.log('我们对他们宣战了')
                generateTip(this, `我们对${this.nation.nationName}宣战了`)
            }
        }
    }
}
