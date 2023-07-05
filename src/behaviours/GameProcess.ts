import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { UnitBehaviour } from "./UnitBehaviour";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Ai_Enemies } from "./Ai_Enemies";
import { Technology } from "./Technology";

export class GameProcess extends Behaviour {
    onStart(): void {
        this.initialNation();
    }

    onUpdate(): void {
        //更新玩家金钱显示
        getGameObjectById("PlayerGoldText").getBehaviour(TextRenderer).text = '金币：' + Nation.nations[1].dora.toString();
    }

    //回合
    turnrNow = 1;
    turnTotal = 100;

    //所有建筑

    initialNation() {
        for (let i = 0; i < Nation.nationQuantity; i++) {
            const nation = new Nation(i + 1, "玩家", 10000, 1);
            Nation.nations[nation.nationId] = nation;
            //nation.randomTechNameList无法在构造器中初始化，因为Technology.getTechByName()需要Nation.techTree
            nation.randomTechList = nation.getRandomTechNameList();
        }
    }


    nextTurn() {
        //每回合开始时，所有领地给予所属国家产出
        Province.updateProvince();

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
            const soilder = getGameObjectById("Soilder").getBehaviour(UnitBehaviour);
            // soilder.ap = soilder.apMax;
            soilder.unitParam.ap = soilder.unitParam.apMax;
        }

        //更新每个国家当前科技的研究进度
        for (let i = 1; i < Nation.nations.length - 1; i++) {
            const nation = Nation.nations[i];
            const currentTech = Technology.getTechByName(nation.nationId, nation.currentTechName);
            if (nation.currentTechName) {
                currentTech.techProcess += nation.techPerTurn;
                if (currentTech.techProcess >= currentTech.techProcessMax) {
                    currentTech.techProcess = currentTech.techProcessMax;
                    console.log(nation.currentTechName + "研究完成");
                    nation.currentTechName = "";
                    nation.randomTechList = nation.getRandomTechNameList();
                }
            }
        }

        // //更新Ai位置
        // getGameObjectById('AiPrefab').getBehaviour(Ai_Enemies).moveToOtherProvinces();

    }

    gameOver() {
        console.log("game over");

        const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
        if (Nation.nations[1].dora > 0) {
            tip.getBehaviour(TextPrefabBinding).text = "游戏胜利";
            tip.getBehaviour(TextPrefabBinding).y = 40;
            getGameObjectById("gameOverImage").getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Win.png"
        }
        else {
            tip.getBehaviour(TextPrefabBinding).text = "游戏失败";
            tip.getBehaviour(TextPrefabBinding).x = 880;
            tip.getBehaviour(TextPrefabBinding).y = 200;
            console.log(this.gameObject)
            getGameObjectById("gameOverImage").getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Defeat.png"
        }
        getGameObjectById("uiRoot").addChild(tip);
    }
}

