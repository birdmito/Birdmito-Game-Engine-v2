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
import { Calculator } from "./Calculator";
import { UnitParam } from "./UnitParam";
import { UnitPrefabBinding } from "../bindings/UnitPrefabBinding";
import { UI_GameOverBinding } from "../bindings/UI_GameOverBinding";
import { Battle, BattleHandler } from "./BattleHandler";

export class GameProcess extends Behaviour {
    static gamingState: 'playerTurn' | 'enemyTurn' | 'settlement' = 'playerTurn';

    static nextState() {
        switch (GameProcess.gamingState) {
            case 'playerTurn':
                //玩家操作的状态
                GameProcess.nextTurn();
                GameProcess.gamingState = 'enemyTurn';
                break;
            case 'enemyTurn':
                //敌人操作的状态
                GameProcess.gamingState = 'settlement';
                break;
            case 'settlement':
                //结算战斗的状态
                GameProcess.gamingState = 'playerTurn';
                break;
        }
    }

    onStart(): void {
        this.initialNation();
        GameProcess.nextTurn();
    }

    onUpdate(): void {
        //更新玩家金钱显示
        getGameObjectById("PlayerGoldText").getBehaviour(TextRenderer).text = '金币：' + Nation.nations[1].dora.toString();
    }

    //回合
    static turnrNow = 0;
    static turnTotal = 10;

    initialNation() {
        for (let i = Nation.nationQuantity - 1; i >= 0; i--) {
            const nation = new Nation(i + 1, "玩家", 10000, 1);
            Nation.nations[nation.nationId] = nation;
            //nation.randomTechNameList无法在构造器中初始化，因为Technology.getTechByName()需要Nation.techTree
            nation.randomTechList = nation.getRandomTechNameList();

            //给每个国家一个初始开拓者
            //获取单位参数
            //随机一个30以内的二维坐标
            const x = Math.floor(Math.random() * 30);
            const y = Math.floor(Math.random() * 30);
            const newUnitParam = UnitParam.copyUnitParam(UnitParam.getProvinceUnitParamByName(Province.provincesObj[i][0].getBehaviour(Province), '开拓者'));
            //生成单位
            const newUnitPrefab = this.engine.createPrefab(new UnitPrefabBinding());
            //配置单位属性
            const prefabBehavior = newUnitPrefab.getBehaviour(UnitBehaviour);
            prefabBehavior.nationId = nation.nationId;
            prefabBehavior.unitParam = newUnitParam;
            prefabBehavior.unitCoor = { x: i, y: 0 }
            //添加到场景中
            getGameObjectById("UnitRoot").addChild(newUnitPrefab);
            console.log("单位所属国家" + prefabBehavior.nationId);
        }
    }


    static nextTurn() {
        //清对国家做遍历，实现每回合执行一次的更新
        for (let i = 1; i < Nation.nations.length; i++) {
            const nation = Nation.nations[i];
            nation.techPerTurn = 100;

            //更新当前研究进度
            const currentTech = Technology.getNationTechByName(nation.nationId, nation.currentTechName);
            if (nation.currentTechName) {
                currentTech.techProcess += nation.techPerTurn;
                if (currentTech.techProcess >= currentTech.techProcessMax) {
                    currentTech.techProcess = currentTech.techProcessMax;
                    console.log(nation.currentTechName + "研究完成");
                    nation.currentTechName = "";
                    nation.randomTechList = nation.getRandomTechNameList();

                    GameProcess.executeTechEffect(currentTech.techName, nation);
                }

                //更新科技树科技研究所需点数
                for (let j = 0; j < nation.techTree.length; j++) {
                    const tech = nation.techTree[j];
                    tech.techProcessMax = Calculator.calculateTechProcessMax(nation, tech);
                }
            }

            //更新已招募的单位信息
            for (let j = 0; j < nation.unitList.length; j++) {
                console.log("国家" + nation.nationId + "的单位" + nation.unitList[j].unitParam.name +
                    "的ap为" + nation.unitList[j].unitParam.ap);
                const unit = nation.unitList[j];
                Calculator.calculateUnitPerTurn(unit);

                // //扣除单位维护费用
                // nation.dora -= nation.unitList[j].unitParam.maintCost;
            }

            //先更新国家属性，因为涉及科技等增益
            nation.updateNationProperties();

            nation.dora += nation.doraChangeNextTurn; ///更新国家金钱
        }


        //后更新领地属性
        this.updateProvincePerTurn();

        this.turnrNow += 1;
        if (this.turnrNow > this.turnTotal) {
            this.turnrNow = this.turnTotal;
        }
        getGameObjectById("TurnText").getBehaviour(TextRenderer).text =
            this.turnrNow.toString() + "/" + this.turnTotal.toString();
        if (this.turnrNow === this.turnTotal) {
            this.gameOver(getGameObjectById("TurnText").getBehaviour(TextRenderer));
        }

        // //更新Ai位置
        // getGameObjectById('AiPrefab').getBehaviour(Ai_Enemies).moveToOtherProvinces();
        //显示玩家省份信息

        //处理战斗
        BattleHandler.handleAllBattle();

    }

    //执行即时的科技效果
    static executeTechEffect(techName: string, nation: Nation) {
        //研究完成后，若有科技再生产科技，则增加现有地块的产出加成+1
        if (Technology.isTechCompleted(nation.nationId, "科技再生产")) {
            Technology.getNationTechByName(nation.nationId, "科技再生产").techEffectValueList[0] += 1;
            const bonusFromTech = Technology.getTechBonus(nation.nationId, "科技再生产");
            console.log(bonusFromTech);
        }
    }



    static updateProvincePerTurn() {
        //每回合开始时，所有领地给予所属国家产出
        for (let i = 0; i < Province.provincesObj.length; i++) {
            for (let j = 0; j < Province.provincesObj[i].length; j++) {
                const province = Province.provincesObj[i][j].getBehaviour(Province);
                province.updateProvinceProperties();  //更新领地产出
                province.giveOwnerTechPoint();  //给予所属国家科技点数
                province.updateProductProcess();  //更新生产队列
            }
        }
    }

    static gameOver(behaviour: Behaviour): void {
        console.log("game over");
        const gameover = behaviour.engine.createPrefab(new UI_GameOverBinding)
        const uiRoot = getGameObjectById("uiRoot")
        uiRoot.addChild(gameover)

        const tip = gameover.children[1]
        const image = gameover.children[0]
        const button = gameover.children[2]
        const buttonText = button.children[1]
        buttonText.getBehaviour(TextRenderer).text = "返回主菜单"
        console.log("image:"+image)

        if (Nation.nations[1].provinceOwnedList.length > 0) {
            tip.getBehaviour(TextRenderer).text = "游戏胜利";

            image.getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Win.png"
        }
        else {
            tip.getBehaviour(TextRenderer).text = "游戏失败";
            image.getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Defeat.png"
        }
    }
}

