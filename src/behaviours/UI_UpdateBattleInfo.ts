import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Battle } from "./BattleHandler";

export class UI_UpdateBattleInfo extends Behaviour {
    battle: Battle;
    onUpdate(): void {
        this.gameObject.getChildById("_BattleDefenderInfoText").getBehaviour(TextRenderer).text =
            "      防守方|       "  + this.battle.defenderNation.nationName + "|"
            + (this.battle.defenderPowerLeft ? ("剩余兵力：" + this.battle.defenderPowerLeft) : ' ');
        this.gameObject.getChildById("_BattleAttackerInfoText").getBehaviour(TextRenderer).text =
            "      进攻方|       "  + this.battle.attackerNation.nationName + "|"
            + (this.battle.attackerPowerLeft ? ("剩余兵力：" + this.battle.attackerPowerLeft) : ' ');
        this.gameObject.getChildById("_LastTurnInfo").getBehaviour(TextRenderer).text =
            "上一回合战斗结果：" + this.battle.lastTurnInfo;
    }
}
