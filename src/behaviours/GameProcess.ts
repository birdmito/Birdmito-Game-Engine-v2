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
import { Statement } from "ts-morph";
import { Transform } from "../engine/Transform";
import { UI_NextTurnButtonRotate } from "./UI_NextButtonRotate";
import { generateTip } from "./Tip";

export class GameProcess extends Behaviour {
    static isCheat = false;  //是否开启作弊模式
    static gamingState: 'playerTurn' | 'botTurn' | 'settlement' = 'playerTurn';
    static playerNationId = 1;  //玩家的nationId
    //游戏模式：热座模式、PVE模式
    static gameMode: 'hotSeat' | 'PVE' = 'hotSeat';


    static nextState() {
        const NextTurnButtonImage = getGameObjectById("NextTurnImage");

        switch (GameProcess.gamingState) {
            case 'playerTurn':
                //玩家操作的状态
                GameProcess.gamingState = 'botTurn';
                //NextTurnButtonImage.getBehaviour(Transform).rotation = 135;
                UI_NextTurnButtonRotate.rotate(NextTurnButtonImage, 120, 20);
                break;
            case 'botTurn':
                //敌人操作的状态
                GameProcess.gamingState = 'settlement';
                //NextTurnButtonImage.getBehaviour(Transform).rotation = 255;
                UI_NextTurnButtonRotate.rotate(NextTurnButtonImage, 120, 20);
                break;
            case 'settlement':
                //结算战斗的状态
                GameProcess.gamingState = 'playerTurn';
                //NextTurnButtonImage.getBehaviour(Transform).rotation = 15;
                UI_NextTurnButtonRotate.rotate(NextTurnButtonImage, 120, 20);
                break;
        }
    }

    onStart(): void {
        GameProcess.updateProvincePerTurn();
        GameProcess.turnrNow = 1;
        GameProcess.turnTotal = 300;
        this.initialNation();
        // GameProcess.nextTurn();
        //让第一个电脑帝国的isThisBotsTurn为true
    }

    onUpdate(): void {
        //更新回合数显示
        getGameObjectById("TurnText").getBehaviour(TextRenderer).text =
            GameProcess.turnrNow.toString() + "/" + GameProcess.turnTotal.toString();

        //更新每个国家收支预告
        Nation.updateDoraChange();

        //按数字键将玩家切换到对应国家
        document.addEventListener('keydown', function (event) {
            const code = event.code;
            if (code >= 'Digit1' && code <= 'Digit3') {
                GameProcess.playerNationId = parseInt(code[5]);
                console.log(`玩家切换到了${GameProcess.playerNationId}号国家`);
                // generateTip(Province.provincesObj[0][0].getBehaviour(Province), `玩家切换到了${GameProcess.playerNationId}号国家`);
            }
        });

        console.log(`当前游戏状态：${GameProcess.gamingState}`);
        //更新玩家金钱显示
        getGameObjectById("PlayerGoldText").getBehaviour(TextRenderer).text = '金币：' + Nation.nations[GameProcess.playerNationId].dora.toString();
        switch (GameProcess.gamingState) {
            case 'playerTurn':
                this.playerTurn();
                break;
            case 'botTurn':
                this.botTurn();
                break;
            case 'settlement':
                this.settlement();
                break;
        }
    }

    //回合
    static turnrNow = 1;
    static turnTotal = 300;

    initialNation() {
        for (let i = Nation.nationQuantity - 1; i >= 0; i--) {
            const nation = new Nation(i + 1, "帝国" + (i + 1), 1000, 1);
            Nation.nations[nation.nationId] = nation;
            //nation.randomTechNameList无法在构造器中初始化，因为Technology.getTechByName()需要Nation.techTree
            nation.randomTechList = nation.getRandomTechNameList();
            nation.updateNationColor();
            nation.nationFlagUrl = `./assets/images/Icon_Flag_${nation.nationId}.png`;


            //给每个国家一个初始开拓者
            //获取单位参数
            //随机一个30以内的二维坐标
            const x = Math.floor(Math.random() * 30);
            const y = Math.floor(Math.random() * 30);

            //获取所有陆地的省份
            var landProvinces: Province[] = [];
            for (let i = 0; i < Province.provincesObj.length; i++) {
                for (let j = 0; j < Province.provincesObj[i].length; j++) {
                    if (Province.provincesObj[i][j].getBehaviour(Province).isLand) {
                        landProvinces.push(Province.provincesObj[i][j].getBehaviour(Province));
                    }
                }
            }
            //随机一个省份
            const randomProvince = landProvinces[Math.floor(Math.random() * landProvinces.length)];

            const newUnitList: UnitParam[] = [
                UnitParam.copyUnitParam(UnitParam.getProvinceUnitParamByName(Province.provincesObj[0][0].getBehaviour(Province), '开拓者')),
                UnitParam.copyUnitParam(UnitParam.getProvinceUnitParamByName(Province.provincesObj[0][0].getBehaviour(Province), '士兵')),
            ];

            for (const unitParam of newUnitList) {
                //生成单位
                const newUnitPrefab = this.engine.createPrefab(new UnitPrefabBinding());
                //配置单位属性
                const prefabBehavior = newUnitPrefab.getBehaviour(UnitBehaviour);
                prefabBehavior.nationId = nation.nationId;
                prefabBehavior.unitParam = unitParam;

                prefabBehavior.unitCoor = { x: randomProvince.coord.x, y: randomProvince.coord.y };
                //添加到场景中
                getGameObjectById("UnitRoot").addChild(newUnitPrefab);
                console.log("单位所属国家" + prefabBehavior.nationId);
            }

            // //生成单位
            // const newUnitPrefab = this.engine.createPrefab(new UnitPrefabBinding());
            // //配置单位属性
            // const prefabBehavior = newUnitPrefab.getBehaviour(UnitBehaviour);
            // prefabBehavior.nationId = nation.nationId;
            // prefabBehavior.unitParam = newSoilder;
            // prefabBehavior.unitCoor = { x: i, y: 0 }


            // //添加到场景中
            // getGameObjectById("UnitRoot").addChild(newUnitPrefab);
            // console.log("单位所属国家" + prefabBehavior.nationId);
        }
    }

    playerTurn() {
        //若玩家城市数为0，则游戏结束
        if (Nation.nations[GameProcess.playerNationId].cityList.length <= 0 && GameProcess.turnrNow > 1) {
            GameProcess.gameOver(Province.provincesObj[0][0].getBehaviour(Province));
        }
        return;
    }

    botTurn() {
        switch (GameProcess.gameMode) {
            case 'hotSeat':
                GameProcess.nextState();  //进入结算阶段
                break;
            case 'PVE':
                //电脑帝国行动
                if (Nation.nations[GameProcess.actingBotNationIndex] && !Nation.nations[GameProcess.actingBotNationIndex].botActMode.isBotOperateFinish) {
                    console.log(`当前行动的电脑帝国：${Nation.nations[GameProcess.actingBotNationIndex].nationId}`);
                    Nation.nations[GameProcess.actingBotNationIndex].botActMode.botAct();  //执行该电脑帝国的行动
                }
                else {
                    //下一个电脑帝国
                    GameProcess.actingBotNationIndex++;
                    //跳过玩家
                    if (GameProcess.actingBotNationIndex === GameProcess.playerNationId) {
                        GameProcess.actingBotNationIndex++;
                    }

                    //判断是否所有电脑帝国都已经行动完毕
                    if (GameProcess.actingBotNationIndex >= Nation.nations.length) {
                        console.log("所有电脑帝国行动完毕");
                        //重置电脑帝国的行动状态
                        for (let i = 2; i < Nation.nations.length; i++) {
                            Nation.nations[i].botActMode.isBotOperateFinish = false;
                        }
                        GameProcess.actingBotNationIndex = 0;
                        GameProcess.nextState();  //进入结算阶段
                        return;
                    }

                    console.log(`遍历到第${GameProcess.actingBotNationIndex}个电脑帝国`)
                    console.log(`电脑帝国${Nation.nations[GameProcess.actingBotNationIndex].nationId}开始行动`);
                    Nation.nations[GameProcess.actingBotNationIndex].botActMode.updateOperatedObjectList();  //更新该电脑帝国的属性
                    console.log(`电脑帝国${Nation.nations[GameProcess.actingBotNationIndex].nationId}有
                            ${Nation.nations[GameProcess.actingBotNationIndex].botActMode.operatedObjectList.length}个操作对象`);
                }
                break;
        }
    }

    //结算阶段
    settlement() {
        //清对国家做遍历，实现每回合执行一次的更新
        for (let i = 1; i < Nation.nations.length; i++) {
            const nation = Nation.nations[i];

            //更新当前研究进度
            const currentTech = Technology.getNationTechByName(nation.nationId, nation.currentTechName);
            if (nation.currentTechName) {
                currentTech.techProcess += nation.techPerTurn;
                if (currentTech.techProcess >= currentTech.techProcessMax) {
                    currentTech.techProcess = currentTech.techProcessMax;
                    console.log(`国家${nation.nationId}的科技${currentTech.techName}研究完成`)
                    if (nation.nationId === GameProcess.playerNationId)
                        generateTip(Nation.nations[1]._capitalProvince, `科技【${currentTech.techName}】研究完成，需要选择新的科技研究`);
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
            //更新科技研究进度后，重置科技研究点数
            nation.techPerTurn = 10;

            //更新已招募的单位信息
            for (let j = 0; j < nation.unitList.length; j++) {
                console.log("国家" + nation.nationId + "的单位" + nation.unitList[j].unitParam.name +
                    "的ap为" + nation.unitList[j].unitParam.ap);
                const unit = nation.unitList[j];
                Calculator.calculateUnitPerTurn(unit);
            }

            //先更新国家属性，因为涉及科技等增益
            nation.updateNationProperties();

            nation.dora += nation.doraChangeNextTurn; ///更新国家金钱

            //更新国家好感度
            for (let i = 1; i <= Nation.nationQuantity; i++) {
                switch (nation.foreignPolicy.get(i)) {
                    case 'negative':
                        Nation.nations[i].favorability.set(nation.nationId, Nation.nations[i].favorability.get(nation.nationId) - 1);  //对方对我好感度-1
                        break;
                    case 'positive':
                        Nation.nations[i].favorability.set(nation.nationId, Nation.nations[i].favorability.get(nation.nationId) + 1);  //对方对我好感度+1
                        break;
                    default:
                        break;
                }
            }
        }


        //更新领地属性
        GameProcess.updateProvincePerTurn();

        GameProcess.turnrNow += 1;
        if (GameProcess.turnrNow > GameProcess.turnTotal) {
            GameProcess.turnrNow = GameProcess.turnTotal;
        }
        if (GameProcess.turnrNow === GameProcess.turnTotal) {
            GameProcess.gameOver(getGameObjectById("TurnText").getBehaviour(TextRenderer));
        }

        // //更新Ai位置
        // getGameObjectById('AiPrefab').getBehaviour(Ai_Enemies).moveToOtherProvinces();
        //显示玩家省份信息

        //处理战斗
        BattleHandler.handleAllBattle();

        GameProcess.nextState();
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


    /**每回合调用一次，更新省份信息 */
    static updateProvincePerTurn() {
        //每回合开始时，所有领地给予所属国家产出
        for (let i = 0; i < Province.provincesObj.length; i++) {
            for (let j = 0; j < Province.provincesObj[i].length; j++) {
                const province = Province.provincesObj[i][j].getBehaviour(Province);
                province.updateProvinceProperties();  //更新领地产出
                province.giveOwnerTechPoint();  //给予所属国家科技点数
                province.updateProductProcessPerTurn();  //更新生产队列
                if (province.unitList.length > 0) {
                    console.log(`${province.coord.x} ${province.coord.y} 有 ${province.unitList.length} 个单位`)
                }
                //合并单位
                if (province.unitList.length > 1) {
                    for (let k = 0; k < province.unitList.length; k++) {
                        const unit = province.unitList[k];
                        console.log(`unit1 name is ${unit.unitParam.name}`)
                        for (let l = k + 1; l < province.unitList.length; l++) {
                            const unit2 = province.unitList[l];
                            console.log(`unit2 name is ${unit2.unitParam.name}`)
                            if (unit.unitParam.name === unit2.unitParam.name && unit.nationId === unit2.nationId) {
                                unit.unitParam.quantity += unit2.unitParam.quantity;  //数量相加
                                //重新计入
                                province.unitList[l].gameObject.destroy();  //销毁单位
                            }
                        }
                    }
                }
            }
        }
        return;
    }

    static actingBotNationIndex = 0;  //当前行动的电脑帝国序号
    static nextTurn() {
        if (this.gamingState === 'playerTurn')
            this.nextState();
    }

    static gameOver(behaviour: Behaviour): void {
        console.log("game over");
        const gameover = behaviour.engine.createPrefab(new UI_GameOverBinding)
        const uiRoot = getGameObjectById("uiRoot")
        uiRoot.addChild(gameover)

        getGameObjectById("MiniMapRoot").destroy()

        const tip = gameover.children[1]
        const image = gameover.children[0]
        const button = gameover.children[2]
        const buttonText = button.children[1]
        buttonText.getBehaviour(TextRenderer).text = "返回主菜单"
        console.log("image:" + image)

        if (Nation.nations[GameProcess.playerNationId].provinceOwnedList.length > 100) {
            tip.getBehaviour(TextRenderer).text = "游戏胜利";

            image.getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Win.png"
        }
        else {
            tip.getBehaviour(TextRenderer).text = "游戏失败";
            image.getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Defeat.png"
        }
    }
}

