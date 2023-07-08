import { Province } from "./Province";
import { UnitBehaviour } from "./UnitBehaviour";

export class BattleManager {
    //存储所有即将发生的战斗的队列
    static battleQueue: Battle[] = [];

    handleAllBattle() {
        //处理所有战斗
        while (BattleManager.battleQueue.length > 0) {
            const battle = BattleManager.battleQueue.shift();
            this.handleBattle(battle);
        }
    }

    //处理一场战斗
    handleBattle(battle: Battle) {
        //战斗双方的总战斗力
        var power1 = 0;
        var power2 = 0;
        for (let unit of battle.attackerUnitList) {
            power1 += unit.unitParam.power
        }
        for (let unit of battle.defenderUnitList) {
            power2 += unit.unitParam.power
        }
        while (power1 > 0 && power2 > 0) {
            //战斗双方投骰子
            const dice1 = Math.random() * 6;
            const dice2 = Math.random() * 6;
            //按照战力的百分之十计算伤害
            if (dice1 > dice2) {
                power2 -= dice1 / 10;
            }
            else {
                power1 -= dice2 / 10;
            }
        }
        //战斗结束，结算剩余单位数量
        if (power1 > 0) {
            //剩余战力，从unitList的尾部开始填充
            var powerLeft = power1;
            for (let i = battle.attackerUnitList.length - 1; i >= 0; i--) {
                if (powerLeft >= battle.attackerUnitList[i].power) {
                    //剩余战力大于等于原始战力，不对单位做修改
                    powerLeft -= battle.attackerUnitList[i].power;
                }
                else {
                    //剩余战力小于原始战力，按照剩余战力计算单位数量
                    const unitQuantity = Math.floor(powerLeft / battle.attackerUnitList[i].unitParam.power);
                    battle.attackerUnitList[i].unitQuantity = unitQuantity;
                    break;
                }
            }
        }
        else if (power2 > 0) {
            //剩余战力，从unitList的尾部开始填充
            var powerLeft = power2;
            for (let i = battle.defenderUnitList.length - 1; i >= 0; i--) {
                if (powerLeft >= battle.defenderUnitList[i].power) {
                    //剩余战力大于等于原始战力，不对单位做修改
                    powerLeft -= battle.defenderUnitList[i].power;
                }
                else {
                    //剩余战力小于原始战力，按照剩余战力计算单位数量
                    const unitQuantity = Math.floor(powerLeft / battle.defenderUnitList[i].unitParam.power);
                    battle.defenderUnitList[i].unitQuantity = unitQuantity;
                    break;
                }
            }
        }
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
}