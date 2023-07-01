import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { ProvinceManager } from "./ProvinceManager";
import { NationManager } from "./NationManager";
import { Province } from "./Province";
import { Soilder } from "./Soilder";

export class GameProcess extends Behaviour {
    onStart(): void {
        this.initialNation();
        this.nextTurn();
    }

    //回合
    turnrNow = 0;
    turnTotal = 2;

    //所有建筑

    initialNation() {
        for (let i = 0; i < NationManager.nationQuantity; i++) {
            const nation = new Nation(i + 1, "玩家", 0, 1);
            NationManager.nationList[nation.nationId] = nation;
        }
    }


    nextTurn() {
        //每回合开始时，所有领地给予所属国家产出
        ProvinceManager.updateProvince();


        //更新玩家金钱显示
        getGameObjectById("PlayerGoldText").getBehaviour(TextRenderer).text = '金币：' + NationManager.nationList[1].money.toString();

        this.turnrNow += 1;
        if (this.turnrNow > this.turnTotal) {
            this.turnrNow = this.turnTotal;
        }
        getGameObjectById("TurnText").getBehaviour(TextRenderer).text =
            this.turnrNow.toString() + "/" + this.turnTotal.toString();
        if (this.turnrNow === this.turnTotal) {
            this.gameOver();
        }

        //更新所有单位的ap
        if (getGameObjectById("Soilder")) {
            const soilder = getGameObjectById("Soilder").getBehaviour(Soilder);
            soilder.ap = soilder.apMax;
        }
    }

    gameOver() {
        console.log("game over");

        const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
        if (NationManager.nationList[1].money > 0) {
            tip.getBehaviour(TextPrefabBinding).text = "游戏胜利";
            tip.getBehaviour(TextPrefabBinding).y = 40;
        }
        else {
            tip.getBehaviour(TextPrefabBinding).text = "游戏失败";
            tip.getBehaviour(TextPrefabBinding).y = 40;
        }
        getGameObjectById("uiRoot").addChild(tip);
    }
}

class Nation {
    constructor(nationId: number = 1, nationName: string = "玩家", money: number = 0, level: number = 1) {
        this.nationId = nationId;
        this.nationName = nationName;
        this.money = money;
        this.level = level;
    }
    nationId: number = 1;  //1-玩家 >2-AI
    nationName: string = "玩家";

    money: number = 0;
    level: number = 1;
}


