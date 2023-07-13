import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class UI_ChangeFavorButton extends Behaviour {
    nation
    onStart(): void {
        const province = SelectedObjectInfoMangaer.selectedBehaviour as Province
        this.nation = Nation.nations[province.nationId]
    }

    onUpdate(): void {
        // 获取玩家对该国家的外交政策
        switch (Nation.nations[GameProcess.playerNationId].foreignPolicy.get(this.nation.nationId)) {
            case 'positive':
                getGameObjectById("_ChangeFavorText").getBehaviour(TextRenderer).text = '更改外交的政策|（当前：改善关系）|（每回合-15奥坎盾）'
                break;
            case 'neutral':
                getGameObjectById("_ChangeFavorText").getBehaviour(TextRenderer).text = '更改外交的政策|（当前：中立）'
                break;
            case 'negative':
                getGameObjectById("_ChangeFavorText").getBehaviour(TextRenderer).text = '更改外交的政策|（当前：恶化关系）|（每回合-15奥坎盾）'
                break;

        }
        this.gameObject.onMouseLeftDown = () => {
            switch (Nation.nations[GameProcess.playerNationId].foreignPolicy.get(this.nation.nationId)) {
                case 'positive':
                    Nation.nations[GameProcess.playerNationId].changeForeignPolicy(this.nation, 'neutral')
                    break;
                case 'neutral':
                    Nation.nations[GameProcess.playerNationId].changeForeignPolicy(this.nation, 'negative')
                    break;
                case 'negative':
                    Nation.nations[GameProcess.playerNationId].changeForeignPolicy(this.nation, 'positive')
                    break;
            }
        }
    }
}
