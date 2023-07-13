import { Nation } from "./Nation";
import { Province } from "./Province";
import { Technology } from "./Technology";
import { UI_BattleInfoButton } from "./UI_BattleInfoButton";
import { UnitBehaviour } from "./UnitBehaviour";

export class BattleHandler {
    //存储所有即将发生的战斗的队列
    static battleQueue: Battle[] = [];

    static handleAllBattle() {
        //处理所有战斗
        for (let battle of BattleHandler.battleQueue) {
            BattleHandler.handleBattle(battle);
        }
    }

    //处理一场战斗
    static handleBattle(battle: Battle) {
        console.log("处理战斗")
        battle.lastTurnInfo = "上一回合战报：|"; //清空上一回合的战斗信息

        //每回合投六次骰子
        for (let i = 0; i < 6; i++) {
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
                var dmg = battle.attackerPowerLeft / 20 * (1 - Technology.getTechBonus(battle.defenderNation.nationId, "配置秘源护盾"))
                dmg = Math.ceil(dmg);  //向上取整
                battle.defenderPowerLeft -= dmg;
                battle.defenderPowerLeft = Math.max(0, battle.defenderPowerLeft); //防止战力为负数
                console.log(`攻击方拼点胜利，防御方损失${dmg}战力`)
                battle.lastTurnInfo += "攻击方拼点胜利，防御方损失" + dmg + "战力||"
            }
            else {
                var dmg = battle.defenderPowerLeft / 20 * (1 - Technology.getTechBonus(battle.attackerNation.nationId, "配置秘源护盾"))
                dmg = Math.ceil(dmg);  //向上取整
                battle.attackerPowerLeft -= dmg;
                battle.attackerPowerLeft = Math.max(0, battle.attackerPowerLeft); //防止战力为负数
                console.log(`防御方拼点胜利，攻击方损失${dmg}战力`)
                battle.lastTurnInfo += "防御方拼点胜利，攻击方损失" + dmg + "战力|"
            }
        }


        var winnerUnitList: UnitBehaviour[] = [];
        var powerLeft;
        //战斗结束，结算剩余单位数量
        if (battle.attackerPowerLeft <= 0 || battle.defenderPowerLeft <= 0) {
            console.log("战斗结束")
            //战斗结束，结算剩余单位数量
            if (battle.attackerPowerLeft > 0) {
                winnerUnitList = battle.attackerUnitList;
                powerLeft = battle.attackerPowerLeft
                //摧毁败方所有单位
                for (let unit of battle.defenderUnitList) {
                    unit.gameObject.destroy();
                }
                //公布战斗结果
                console.log(`发生在领地 ${battle.province.coord.x} ${battle.province.coord.y}的战斗，进攻方胜利`);
            }
            else if (battle.defenderPowerLeft > 0) {
                winnerUnitList = battle.defenderUnitList;
                powerLeft = battle.defenderPowerLeft
                //摧毁进攻方所有单位
                for (let unit of battle.attackerUnitList) {
                    unit.gameObject.destroy();
                }
                //公布战斗结果
                console.log(`发生在领地 ${battle.province.coord.x} ${battle.province.coord.y}的战斗，防守方胜利`);
            }

            //计算剩余战力，从unitList的尾部开始填充
            for (let i = winnerUnitList.length - 1; i >= 0; i--) {
                //先清空单位的数量
                winnerUnitList[i].unitParam.quantity = 0;
                winnerUnitList[i].isInCombat = false;
                if (powerLeft >= winnerUnitList[i].power) {
                    //剩余战力大于等于原始战力，不对单位做修改
                    console.log(`对单位 ${winnerUnitList[i].unitParam.name} 不做修改`)
                    powerLeft -= winnerUnitList[i].power;
                }
                else if (powerLeft > 0) {
                    //剩余战力小于原始战力，按照剩余战力计算单位数量
                    const unitQuantity = Math.floor(powerLeft / winnerUnitList[i].unitParam.power);
                    //保证维护费计算正确
                    Nation.nations[winnerUnitList[i].unitParam.nationId].dora
                        += (unitQuantity - winnerUnitList[i].unitParam.quantity) * winnerUnitList[i].unitParam.maintCost;
                    winnerUnitList[i].unitParam.quantity = unitQuantity;
                    powerLeft -= unitQuantity * winnerUnitList[i].unitParam.power;
                    console.log(`对单位 ${winnerUnitList[i].unitParam.name} 修改数量为 ${unitQuantity}`)
                }
                else {
                    break;
                }
            }
            //遍历单位，若数量为0则销毁
            for (let unit of winnerUnitList) {
                if (unit.unitParam.quantity == 0) {
                    unit.gameObject.destroy();
                }
                else {
                    //若数量不为0，则将单位移动到_UnitRoot
                    unit.gameObject.changeParent(unit.currentProvince.gameObject.getChildById("_UnitRoot"));
                }
            }

            //销毁战斗
            battle.province.gameObject.getChildById("_BattleInfoButtonRoot").children[0].destroy();
            battle.province.battle = undefined;

            //从战斗队列中移除
            BattleHandler.battleQueue.splice(BattleHandler.battleQueue.indexOf(battle), 1);

            //删除battle
            battle = undefined;
        }
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

    lastTurnInfo: string = " ";
}