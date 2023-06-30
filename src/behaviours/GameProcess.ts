import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { MapManager } from "./MapManager";
import { Province } from "./Province";

export class GameProcess extends Behaviour {
    onStart(): void {
        this.nextTurn();
        this.initialNation();
    }

    //回合
    turnrNow = 0;
    turnTotal = 2;
    static nationList: any;

    //国家
    nationQuantity = 1;
    nationList: Nation[] = [];
    initialNation() {
        for (let i = 0; i < this.nationQuantity; i++) {
            const nation = new Nation();
            nation.nationId = i + 1; //在Province中0代表野地，故从1开始赋值
            this.nationList.push(new Nation());
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
        if (getGameObjectById("Map").getBehaviour(MapManager).provinces[0][0].getBehaviour(Province).nationId == 1) {
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
    nationId: number = 1;  //1-玩家 >2-AI
    nationName: string = "玩家";

    money: number = 0;
    level: number = 1;
}
