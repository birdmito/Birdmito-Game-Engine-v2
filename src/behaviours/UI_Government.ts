import { UI_governmentWindowPrefabBinding } from "../bindings/UI_governmentWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Technology } from "./Technology";

export class UI_Government extends Behaviour {
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
