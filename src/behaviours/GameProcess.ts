import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { UnitBehaviour } from "./UnitBehaviour";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Technology } from "./Technology";

export class GameProcess extends Behaviour {
    onStart(): void {
        this.initialNation();

    }

    onUpdate(): void {
    }

    //回合
    turnrNow = 1;
    turnTotal = 100;

    //初始化国家
    initialNation() {
        for (let i = 0; i < Nation.nationQuantity; i++) {
            const nation = new Nation(i + 1, "玩家", 10000, 1);
            Nation.nationList[nation.nationId] = nation;
        }
    }


    nextTurn() {
        //每回合开始时，所有领地给予所属国家产出
        Province.updateProvince();
        this.updateNationTechPerTurn();

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
            soilder.unitParam.ap = soilder.unitParam.apMax;
        }

        //更新每个国家当前科技的研究进度
        for (let i = 1; i < Nation.nationList.length - 1; i++) {
            const nation = Nation.nationList[i];
            if (nation.currentTechName) {
                Technology.getTechByName(i, nation.currentTechName).techProcess += nation.techPerTurn;
                console.log(nation.currentTechName);
                console.log(Technology.getTechByName(nation.nationId, nation.currentTechName).techProcess);
                console.log(Technology.getTechByName(nation.nationId, nation.currentTechName).techProcessMax);
            }
        }
    }

    gameOver() {
        console.log("game over");

        const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
        if (Nation.nationList[1].dora > 0) {
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

    //遍历所有领地，并更新所属国家的每回合科技点
    updateNationTechPerTurn() {
        //先清零
        for (let i = 1; i < Nation.nationList.length - 1; i++) {
            Nation.nationList[i].techPerTurn = 0;
        }

        //再更新
        for (let i = 0; i < Province.provinces.length; i++) {
            for (let j = 0; j < Province.provinces[i].length; j++) {
                if (Province.provinces[i][j].getBehaviour(Province).nationId === 0) continue;  //如果该领地没有归属国家，则跳过
                const province = Province.provinces[i][j].getBehaviour(Province);
                const nation = Nation.nationList[province.nationId];
                nation.techPerTurn += province.provinceProduction.techPoint;
            }
        }
    }
}
