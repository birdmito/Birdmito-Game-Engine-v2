import { UI_governmentWindowPrefabBinding } from "../bindings/UI_governmentWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Technology } from "./Technology";

export class UI_UpdateGovernmentStatic extends Behaviour {
    //管理政府界面
    onStart(): void {
    }

    onUpdate(): void {
        //更新玩家帝国金钱显示
        getGameObjectById("PlayerGoldText").getBehaviour(TextRenderer).text = '奥坎盾：' + Nation.nations[GameProcess.playerNationId].dora.toString();
        //更新玩家帝国等级显示
        getGameObjectById("PlayerLevelText").getBehaviour(TextRenderer).text = '政府等级：' + Nation.nations[GameProcess.playerNationId].level.toString()
        getGameObjectById("PlayerCapacityText").getBehaviour(TextRenderer).text = "城市上限：" + Nation.nations[GameProcess.playerNationId].cityList.length.toString() + '/' + Nation.nations[GameProcess.playerNationId].cityMax.toString();
        //更新玩家帝国科技点增长显示
        getGameObjectById("PlayerTechText").getBehaviour(TextRenderer).text = '科技点：+' + Nation.nations[GameProcess.playerNationId].techPerTurn.toString();
        //更新旗帜
        getGameObjectById("_PlayersGovernmentFlag").getBehaviour(BitmapRenderer).source = Nation.nations[GameProcess.playerNationId].nationFlagUrl;
        //更新玩家帝国下回合金钱变化
        getGameObjectById("_PlayerGoldChangeText").getBehaviour(TextRenderer).text = '每回合变动' + Nation.nations[GameProcess.playerNationId].doraChangeNextTurn.toString();
        getGameObjectById("_PlayerGoldChangeText").getBehaviour(TextRenderer).text += `|省份：${Nation.nations[GameProcess.playerNationId].doraChangeFromProvince.toString()}`;
        getGameObjectById("_PlayerGoldChangeText").getBehaviour(TextRenderer).text += `|建筑：${Nation.nations[GameProcess.playerNationId].doraChangeFromBuilding.toString()}`;
        getGameObjectById("_PlayerGoldChangeText").getBehaviour(TextRenderer).text += `|单位：${Nation.nations[GameProcess.playerNationId].doraChangeFromUnit.toString()}`;
        getGameObjectById("_PlayerGoldChangeText").getBehaviour(TextRenderer).text += `|其他：${Nation.nations[GameProcess.playerNationId].doraChangeFromOther.toString()}`;
        if (Nation.nations[GameProcess.playerNationId].dora < 0) {
            getGameObjectById("_PlayerGoldChangeText").getBehaviour(TextRenderer).text += '||我们正在负债！|科研进度-80%|所有省份生产力-80%|单位战力-80%';
        }


        this.gameObject.onMouseLeftDown = () => {
            //弹出政府界面
            const governmentWindow = this.gameObject.engine.createPrefab(new UI_governmentWindowPrefabBinding);
            if (getGameObjectById("GovernmentWindowRoot").children.length > 0) {
                getGameObjectById("GovernmentWindowRoot").children[0].destroy();
            } else {
                getGameObjectById("GovernmentWindowRoot").addChild(governmentWindow);//更新玩家帝国当前科技显示 
                if (Nation.nations[GameProcess.playerNationId].currentTechName !== '') {
                    getGameObjectById("CurrentTechText").getBehaviour(TextRenderer).text =
                        "当前科技：" + Technology.getNationTechByName(1, Nation.nations[GameProcess.playerNationId].currentTechName).getInfo();
                }
            }
        }
    }
}
