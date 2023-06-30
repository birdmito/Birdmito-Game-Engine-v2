import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { MapManager } from "./MapManager";
import { Province } from "./Province";

export class GameProcess extends Behaviour {
    onStart(): void {
        this.initialNation();
        this.nextTurn();
    }

    //回合
    turnrNow = 0;
    turnTotal = 2;

    //国家
    nationQuantity = 2;
    static nationList: Nation[] = [];
    initialNation() {
        for (let i = 0; i < this.nationQuantity; i++) {
            const nation = new Nation(i + 1, "玩家", 0, 1);
            GameProcess.nationList[nation.nationId] = nation;
        }
    }


    nextTurn() {
        //每回合开始时，所有领地给予所属国家产出
        const mapManager = getGameObjectById("Map").getBehaviour(MapManager);
        for (let i = 0; i < mapManager.provinces.length; i++) {
            for (let j = 0; j < mapManager.provinces[i].length; j++) {
                const province = mapManager.provinces[i][j].getBehaviour(Province);
                province.giveOwnerProduction();
            }
        }
        //更新玩家金钱显示
        getGameObjectById("PlayerGoldText").getBehaviour(TextRenderer).text = GameProcess.nationList[1].money.toString();

        this.turnrNow += 1;
        if (this.turnrNow > this.turnTotal) {
            this.turnrNow = this.turnTotal;
        }
        getGameObjectById("TurnText").getBehaviour(TextRenderer).text =
            this.turnrNow.toString() + "/" + this.turnTotal.toString();
        if (this.turnrNow === this.turnTotal) {
            this.gameOver();
        }
    }

    gameOver() {
        console.log("game over");

        const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
        if (GameProcess.nationList[1].money > 0) {
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
