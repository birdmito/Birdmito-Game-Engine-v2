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
import { ColonialProvinces } from "./ColonialProvinces";

export class GameProcess extends Behaviour {
    onStart(): void {
        this.initialNation();
        this.nextTurn();
    }

    onUpdate(): void {
        //更新玩家金钱显示
        getGameObjectById("PlayerGoldText").getBehaviour(TextRenderer).text = '金币：' + Nation.nations[1].dora.toString();
    }

    //回合
    turnrNow = 0;
    turnTotal = 100;

    initialNation() {
        for (let i = 0; i < Nation.nationQuantity; i++) {
            const nation = new Nation(i + 1, "玩家", 10000, 1);
            Nation.nations[nation.nationId] = nation;
            //nation.randomTechNameList无法在构造器中初始化，因为Technology.getTechByName()需要Nation.techTree
            nation.randomTechList = nation.getRandomTechNameList();
        }
    }


    nextTurn() {
        //清零所有国家的科技点增长
        for (let i = 1; i < Nation.nations.length - 1; i++) {
            const nation = Nation.nations[i];
            nation.techPerTurn = 100;
        }
        //每回合开始时，更新领地属性
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

        //更新国家属性
        Nation.updateNation();

        // //更新Ai位置
        // getGameObjectById('AiPrefab').getBehaviour(Ai_Enemies).moveToOtherProvinces();
        //显示玩家省份信息

    }

    gameOver() {
        console.log("game over");

        const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)

        tip.getBehaviour(TextPrefabBinding).x = 880;
        tip.getBehaviour(TextPrefabBinding).y = 200;
        
        if (Nation.nations[1].provinceOwnedList.length > 0) {
            tip.getBehaviour(TextPrefabBinding).text = "游戏胜利";
            getGameObjectById("gameOverImage").getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Win.png"
        }
        else {
            tip.getBehaviour(TextPrefabBinding).text = "游戏失败";
            console.log(this.gameObject)
            getGameObjectById("gameOverImage").getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Defeat.png"
        }
        getGameObjectById("uiRoot").addChild(tip);
    }
}

