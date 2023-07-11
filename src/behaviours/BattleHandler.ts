import { Nation } from "./Nation";
import { Province } from "./Province";
import { Technology } from "./Technology";
import { UnitBehaviour } from "./UnitBehaviour";

export class BattleHandler {
    //存储所有即将发生的战斗的队列
    static battleQueue: Battle[] = [];

    static handleAllBattle() {
        //处理所有战斗
        while (BattleHandler.battleQueue.length > 0) {
            const battle = BattleHandler.battleQueue.shift();
            BattleHandler.handleBattle(battle);
        }
    }

    //处理一场战斗
    static handleBattle(battle: Battle) {
        //战斗双方的总战斗力
        var attackerPower = 0;
        var defenderPower = 0;
        for (let unit of battle.attackerUnitList) {
            attackerPower += unit.power
        }
        for (let unit of battle.defenderUnitList) {
            defenderPower += unit.power
        }
        while (attackerPower > 0 && defenderPower > 0) {
            //战斗双方投骰子
            var attackerDice = Math.random() * 6 + Technology.getTechBonus(battle.attackerNation.nationId, "先进机械装配", 1);
            if (battle.attackerUnitList.some(unit => unit.unitParam.name === "自走火炮")) {
                attackerDice += 1
            }
            var defencerDice = Math.random() * 6 + Technology.getTechBonus(battle.defenderNation.nationId, "先进机械装配", 1);
            if (battle.defenderUnitList.some(unit => unit.unitParam.name === "自走火炮")) {
                defencerDice += 1
            }
            //按照战力的百分之十计算伤害
            if (attackerDice > defencerDice) {
                defenderPower -= attackerPower / 10 * (1 - Technology.getTechBonus(battle.defenderNation.nationId, "配置秘源护盾"))
            }
            else {
                attackerPower -= defenderPower / 10 * (1 - Technology.getTechBonus(battle.attackerNation.nationId, "配置秘源护盾"))
            }
        }

        //战斗结束，结算剩余单位数量
        if (attackerPower > 0) {
            //摧毁防守方所有单位
            for (let unit of battle.defenderUnitList) {
                unit.gameObject.destroy();
            }
            //剩余战力，从unitList的尾部开始填充
            var powerLeft = attackerPower;
            for (let i = battle.attackerUnitList.length - 1; i >= 0; i--) {
                //先清空所有单位的数量
                battle.attackerUnitList[i].unitParam.quantity = 0;
                battle.attackerUnitList[i].isInCombat = false;
                if (powerLeft >= battle.attackerUnitList[i].power) {
                    //剩余战力大于等于原始战力，不对单位做修改
                    powerLeft -= battle.attackerUnitList[i].power;
                }
                else {
                    //剩余战力小于原始战力，按照剩余战力计算单位数量
                    const unitQuantity = Math.ceil(powerLeft / battle.attackerUnitList[i].unitParam.power);
                    battle.attackerUnitList[i].unitParam.quantity = unitQuantity;
                    break;
                }
            }
            //遍历进攻方单位，若数量为0则销毁
            for (let unit of battle.attackerUnitList) {
                if (unit.unitParam.quantity == 0) {
                    unit.gameObject.destroy();
                }
                else {
                    //若数量不为0，则将单位移动到_UnitRoot
                    unit.gameObject.changeParent(unit.currentProvince.gameObject.getChildById("_UnitRoot"));
                }
            }
            //公布战斗结果
            console.log(`发生在领地 ${battle.province.coord.x} ${battle.province.coord.y}的战斗，进攻方胜利`);
        }
        else if (defenderPower > 0) {
            //摧毁进攻方所有单位
            for (let unit of battle.attackerUnitList) {
                unit.gameObject.destroy();
            }
            //剩余战力，从unitList的尾部开始填充
            var powerLeft = defenderPower;
            for (let i = battle.defenderUnitList.length - 1; i >= 0; i--) {
                battle.defenderUnitList[i].isInCombat = false;
                if (powerLeft >= battle.defenderUnitList[i].power) {
                    //剩余战力大于等于原始战力，不对单位做修改
                    powerLeft -= battle.defenderUnitList[i].power;
                }
                else {
                    //剩余战力小于原始战力，按照剩余战力计算单位数量
                    const unitQuantity = Math.ceil(powerLeft / battle.defenderUnitList[i].unitParam.power);
                    battle.defenderUnitList[i].unitParam.quantity = unitQuantity;
                    break;
                }
            }
            //遍历防守方单位，若数量为0则销毁
            for (let unit of battle.attackerUnitList) {
                if (unit.unitParam.quantity == 0) {
                    unit.gameObject.destroy();
                }
            }
            //公布战斗结果
            console.log(`发生在领地 ${battle.province.coord.x} ${battle.province.coord.y}的战斗，防守方胜利`);
        }

        //销毁战斗
        battle.province.battle = undefined;
    }
}

export class Battle {
    constructor() {
        this.province = new Province();
        this.attackerUnitList = new Array<UnitBehaviour>
        this.defenderUnitList = new Array<UnitBehaviour>
    }
    //战斗发生的地点
    province: Province;
    //战斗双方的单位
    attackerUnitList: UnitBehaviour[]
    defenderUnitList: UnitBehaviour[]
    //战斗双方的国家
    attackerNation: Nation;
    defenderNation: Nation;
}