import { GameObject } from "../engine";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { Tech, Technology } from "./Technology";
import { UI_BattleInfoButton } from "./UI_BattleInfoButton";
import { UnitBehaviour } from "./UnitBehaviour";

export class BattleHandler {
    //存储所有即将发生的战斗的队列
    static battleQueue: Battle[] = [];

    static handleAllBattle() {
        let battleToDelete: Battle[] = [];
        //处理所有战斗
        for (let battle of BattleHandler.battleQueue) {
            if (BattleHandler.handleBattle(battle)) {
                battleToDelete.push(battle);
            }
        }

        //销毁战斗
        battleToDelete.forEach(battle => {
            battle.battleInfoButton.destroy();
            battle.province.battle = undefined;
            //从战斗队列中移除
            BattleHandler.battleQueue.splice(BattleHandler.battleQueue.indexOf(battle), 1);
        });
    }

    //处理一场战斗
    static handleBattle(battle: Battle) {
        console.log("处理战斗")
        battle.lastTurnInfo = "               上一回合战报：||||"; //清空上一回合的战斗信息

        let rollDice = (sides: number, nationId: number, enemyNationId: number, unitList: UnitBehaviour[]) => {
            let advantage = 0;
            // 自走火炮提供1优势值
            if (unitList.some(unit => unit.unitParam.name === "自走火炮")) {
                advantage += 1;
            }
            // 处于敌方领土时，若周围一格有敌方城市且对方拥有【布置城防】科技，-1优势值
            let adjacentProvinces = battle.province.getAdjacentProvinces();
            if (adjacentProvinces.some(province => province.isCity && province.nationId === enemyNationId)) {
                advantage += Technology.getTechBonus(enemyNationId, Tech.布置城防);
            }

            let result = 0;
            result = Math.random() * sides;
            if (advantage > 0) {
                // 优势，再投一次，取最高值
                result = Math.max(result, Math.random() * sides);

            } else if (advantage < 0) {
                // 劣势，再投一次，取最低值
                result = Math.min(result, Math.random() * sides);
            }
            result += Technology.getTechBonus(nationId, Tech.先进机械装配, 1); // 先进机械装配提供+1点数

            result = Math.max(result, 1);  //最少投掷出1点
            result = Math.min(result, sides);  //最多投掷出sides点
            return result;
        }

        //每回合投六次骰子
        for (let i = 0; i < 6; i++) {
            //战斗双方投骰子
            var attackerDice = rollDice(6, battle.attackerNation.nationId, battle.defenderNation.nationId, battle.attackerUnitList);
            var defencerDice = rollDice(6, battle.defenderNation.nationId, battle.attackerNation.nationId, battle.defenderUnitList);

            //按照战力的百分之十计算伤害
            if (attackerDice > defencerDice) {
                var dmg = battle.attackerPowerLeft / 10 * (1 + Technology.getTechBonus(battle.defenderNation.nationId, Tech.配置秘源护盾))
                dmg = Math.ceil(dmg);  //向上取整
                battle.defenderPowerLeft -= dmg;
                battle.defenderPowerLeft = Math.max(0, battle.defenderPowerLeft); //防止战力为负数
                console.log(`攻击方拼点胜利，防御方损失${dmg}战力`)
                battle.lastTurnInfo += "攻击方拼点胜利，防御方损失" + dmg + "战力|||"
            }
            else if (defencerDice > attackerDice) {
                var dmg = battle.defenderPowerLeft / 10 * (1 + Technology.getTechBonus(battle.attackerNation.nationId, Tech.配置秘源护盾))
                dmg = Math.ceil(dmg);  //向上取整
                battle.attackerPowerLeft -= dmg;
                battle.attackerPowerLeft = Math.max(0, battle.attackerPowerLeft); //防止战力为负数
                console.log(`防御方拼点胜利，攻击方损失${dmg}战力`)
                battle.lastTurnInfo += "防御方拼点胜利，攻击方损失" + dmg + "战力|||"
            } else {
                console.log("平局，双方损失相当于对方战力5%的战力")
                dmg = Math.ceil(battle.defenderPowerLeft / 20 * (1 + Technology.getTechBonus(battle.attackerNation.nationId, Tech.配置秘源护盾)));
                battle.attackerPowerLeft -= dmg;
                battle.attackerPowerLeft = Math.max(0, battle.attackerPowerLeft); //防止战力为负数
                console.log(`平局，攻击方损失${dmg}战力`)
                battle.lastTurnInfo += "平局，攻击方损失" + dmg + "战力|||"
                dmg = Math.ceil(battle.attackerPowerLeft / 20 * (1 + Technology.getTechBonus(battle.defenderNation.nationId, Tech.配置秘源护盾)));
                battle.defenderPowerLeft -= dmg;
                battle.defenderPowerLeft = Math.max(0, battle.defenderPowerLeft); //防止战力为负数
                console.log(`平局，防御方损失${dmg}战力`)
                battle.lastTurnInfo += "平局，防御方损失" + dmg + "战力|||"
            }
        }

        let handleLeftUnit = (unitList: UnitBehaviour[], power: number) => {
            let sortedUnits = unitList.slice().sort((a, b) => a.unitParam.priority - b.unitParam.priority);
            //按照优先级从高到低分配单位数量
            for (let unit of sortedUnits) {
                if (power >= unit.power) {
                    //剩余战力大于等于原始战力，不对单位做修改
                    console.log(`对单位 ${unit.unitParam.name} 不做修改`)
                    power -= unit.power;
                } else if (power > 0) {
                    //剩余战力小于原始战力，按照剩余战力计算单位数量
                    const unitQuantity = Math.floor(power / unit.unitParam.power);
                    //保证维护费计算正确
                    Nation.nations[unit.unitParam.nationId].dora
                        += (unitQuantity - unit.unitParam.quantity) * unit.unitParam.maintCost;
                    unit.unitParam.quantity = unitQuantity;
                    power -= unitQuantity * unit.unitParam.power;
                    console.log(`对单位 ${unit.unitParam.name} 修改数量为 ${unitQuantity}`)
                } else {
                    //剩余战力为0，直接跳出循环
                    break;
                }
            }

            //遍历单位，若数量为0则销毁
            for (let unit of unitList) {
                if (unit.unitParam.quantity == 0) {
                    unit.gameObject.destroy();
                    unitList.splice(unitList.indexOf(unit), 1);
                }
            }
        }

        handleLeftUnit(battle.attackerUnitList, battle.attackerPowerLeft);
        handleLeftUnit(battle.defenderUnitList, battle.defenderPowerLeft);

        if (battle.attackerPowerLeft <= 0 || battle.defenderPowerLeft <= 0) {
            let winnerUnitList: UnitBehaviour[] = battle.attackerPowerLeft > 0 ? battle.attackerUnitList : battle.defenderUnitList;
            winnerUnitList.forEach(unit => {
                unit.isInCombat = false;
                unit.gameObject.changeParent(unit.currentProvince.gameObject.getChildById("_UnitRoot"));
            });
            return true;
        } else {
            return false;
        }

        // var winnerUnitList: UnitBehaviour[] = [];
        // var powerLeft;
        // //战斗结束，结算剩余单位数量
        // if (battle.attackerPowerLeft <= 0 || battle.defenderPowerLeft <= 0) {
        //     console.log("战斗结束")
        //     //战斗结束，结算剩余单位数量
        //     if (battle.attackerPowerLeft > 0) {
        //         winnerUnitList = battle.attackerUnitList;
        //         powerLeft = battle.attackerPowerLeft
        //         //摧毁败方所有单位
        //         for (let unit of battle.defenderUnitList) {
        //             unit.gameObject.destroy();
        //         }
        //         //公布战斗结果
        //         console.log(`发生在领地 ${battle.province.coord.x} ${battle.province.coord.y}的战斗，进攻方胜利`);
        //     }
        //     else if (battle.defenderPowerLeft > 0) {
        //         winnerUnitList = battle.defenderUnitList;
        //         powerLeft = battle.defenderPowerLeft
        //         //摧毁进攻方所有单位
        //         for (let unit of battle.attackerUnitList) {
        //             unit.gameObject.destroy();
        //         }
        //         //公布战斗结果
        //         console.log(`发生在领地 ${battle.province.coord.x} ${battle.province.coord.y}的战斗，防守方胜利`);
        //     }

        //     //计算剩余战力，从unitList的尾部开始填充
        //     for (let i = winnerUnitList.length - 1; i >= 0; i--) {
        //         //先清空单位的数量
        //         // winnerUnitList[i].unitParam.quantity = 0;
        //         winnerUnitList[i].isInCombat = false;
        //         if (powerLeft >= winnerUnitList[i].power) {
        //             //剩余战力大于等于原始战力，不对单位做修改
        //             console.log(`对单位 ${winnerUnitList[i].unitParam.name} 不做修改`)
        //             powerLeft -= winnerUnitList[i].power;
        //         }
        //         else if (powerLeft > 0) {
        //             //剩余战力小于原始战力，按照剩余战力计算单位数量
        //             const unitQuantity = Math.floor(powerLeft / winnerUnitList[i].unitParam.power);
        //             //保证维护费计算正确
        //             Nation.nations[winnerUnitList[i].unitParam.nationId].dora
        //                 += (unitQuantity - winnerUnitList[i].unitParam.quantity) * winnerUnitList[i].unitParam.maintCost;
        //             winnerUnitList[i].unitParam.quantity = unitQuantity;
        //             powerLeft -= unitQuantity * winnerUnitList[i].unitParam.power;
        //             console.log(`对单位 ${winnerUnitList[i].unitParam.name} 修改数量为 ${unitQuantity}`)
        //         }
        //         else {
        //             break;
        //         }
        //     }
        //     //遍历单位，若数量为0则销毁
        //     for (let unit of winnerUnitList) {
        //         if (unit.unitParam.quantity == 0) {
        //             unit.gameObject.destroy();
        //         }
        //         else {
        //             //若数量不为0，则将单位移动到_UnitRoot
        //             unit.gameObject.changeParent(unit.currentProvince.gameObject.getChildById("_UnitRoot"));
        //         }
        //     }

        //     //销毁战斗
        //     battle.battleInfoButton.destroy();
        //     battle.province.battle = undefined;

        //     //从战斗队列中移除
        //     BattleHandler.battleQueue.splice(BattleHandler.battleQueue.indexOf(battle), 1);

        //     //删除battle
        //     battle = undefined;
        // }
    }
}

export class Battle {
    constructor() {
        this.province = new Province();
        this.attackerUnitList = new Array<UnitBehaviour>
        this.defenderUnitList = new Array<UnitBehaviour>
        this.attackerPowerLeft = 0;
        this.defenderPowerLeft = 0;
    }
    //战斗发生的地点
    province: Province;
    //战斗双方的单位
    attackerUnitList: UnitBehaviour[]
    defenderUnitList: UnitBehaviour[]
    //战斗双方的国家
    attackerNation: Nation;
    defenderNation: Nation;
    //战斗双方的剩余战力
    attackerPowerLeft: number;
    defenderPowerLeft: number;

    battleInfoButton: GameObject;

    lastTurnInfo: string = " ";
}