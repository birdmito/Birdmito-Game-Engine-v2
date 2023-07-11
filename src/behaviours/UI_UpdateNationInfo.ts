import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";

export class UI_UpdateNationInfo extends Behaviour {
    nation: Nation;
    onStart(): void {
        const province = SelectedObjectInfoMangaer.selectedBehaviour as Province
        const nation = Nation.nations[province.nationId]
        this.nation = nation;
    }
    onUpdate(): void {
        getGameObjectById("_NationNameText").getBehaviour(TextRenderer).text = 'ID：' + this.nation.nationId.toString();
        getGameObjectById("_NationGoldText").getBehaviour(TextRenderer).text = '经济：' + this.nation.dora.toString();
        getGameObjectById("_NationTechText").getBehaviour(TextRenderer).text = '科技：' + this.nation.techPerTurn.toString();
        getGameObjectById("_NationArmyText").getBehaviour(TextRenderer).text = '军事：' + this.nation.unitList.length.toString();
        getGameObjectById("_NationFavorText").getBehaviour(TextRenderer).text = '他们对我们的态度：' + this.nation.favorability.get(GameProcess.playerNationId).toString();
        getGameObjectById("_NationFavorText").getBehaviour(TextRenderer).text += '|我们对他们的态度：' + Nation.nations[GameProcess.playerNationId].favorability.get(this.nation.nationId).toString();
    }
}
