import { Province } from "./Province";
import { infoShowable } from "./infoShowable";
import { GameProcess } from "./GameProcess";

export class UnitParam implements infoShowable {
    static originUnitParamList: UnitParam[] = [
        new UnitParam("开拓者", 10, 10, 8, 15, 1),
        new UnitParam("筑城者", 10, 10, 8, 15, 1),
        new UnitParam("士兵", 10, 10, 8, 20, 1, true, 1, 10),
        new UnitParam("自走火炮", 10, 10, 8, 20, 1, true, 1, 10, '先进自走火炮'),
    ];

    private constructor(name: string, cost: number, recruitProcessMax: number, apMax: number,
        maintCost: number, nationId: number = 1, isBattleUnit: boolean = false, quantity: number = 1, power: number = 0, techRequired = '') {
        this.name = name;
        this.cost = cost;
        this.recruitProcessMax = recruitProcessMax;
        this.apMax = apMax;
        this.ap = apMax;
        this.maintCost = maintCost;
        this.nationId = nationId;
        this.isBattleUnit = isBattleUnit;
        this.quantity = quantity;
        this.power = power;
        this.techRequired = techRequired;
    }

    static copyOriginUnitParamList(nationId: number = GameProcess.playerNationId): UnitParam[] {
        const result: UnitParam[] = [];
        UnitParam.originUnitParamList.forEach((unitParam) => {
            result.push(new UnitParam(unitParam.name, unitParam.cost, unitParam.recruitProcessMax, unitParam.apMax,
                unitParam.maintCost, nationId, unitParam.isBattleUnit, unitParam.quantity, unitParam.power));
        });
        return result;
    }

    static copyUnitParam(unitParam: UnitParam): UnitParam {
        return new UnitParam(unitParam.name, unitParam.cost, unitParam.recruitProcessMax, unitParam.apMax,
            unitParam.maintCost, unitParam.nationId, unitParam.isBattleUnit, unitParam.quantity, unitParam.power, unitParam.techRequired);
    }

    /**获得目标省份可招募单位列表中的目标单位（属性已经过修正） */
    static getProvinceUnitParamByName(province: Province, name: string): UnitParam {
        for (let i = 0; i < province.recruitableUnitList.length; i++) {
            if (province.recruitableUnitList[i].name === name) {
                return province.recruitableUnitList[i];
            }
        }
        return null;
    }

    static getOriginUnitParamByName(name: string): UnitParam {
        for (let i = 0; i < UnitParam.originUnitParamList.length; i++) {
            if (UnitParam.originUnitParamList[i].name === name) {
                return UnitParam.originUnitParamList[i];
            }
        }
        return null;
    }

    name: string = "未命名单位";
    cost: number = 10;
    recruitProcess: number = 10;
    recruitProcessMax: number = 10;
    nationId: number = 1;
    ap: number = 100000;
    apMax: number = 10;
    maintCost: number = 1;
    //需要科技解锁
    techRequired: string;

    //战斗属性
    //是否是战斗单位
    isBattleUnit: boolean = false;
    //单位数量
    quantity: number = 1;
    //战力
    power: number = 1;

    static getUnitParamWhichAllParamIsOne(): UnitParam {
        return new UnitParam('这是一段不应该被看到的文本', 1, 1, 1, 1, 1);
    }

    static getUnitParamWhichAllParamIsZero(): UnitParam {
        return new UnitParam('这是一段不应该被看到的文本', 0, 0, 0, 0, 0);
    }

    multiplyUnitParam(multiplier: UnitParam): UnitParam {
        this.cost *= multiplier.cost;
        this.recruitProcessMax *= multiplier.recruitProcessMax;
        this.apMax *= multiplier.apMax;
        this.maintCost *= multiplier.maintCost;
        return this;
    }

    addUnitParam(unit: UnitParam): UnitParam {
        this.cost += unit.cost;
        this.recruitProcessMax += unit.recruitProcessMax;
        this.apMax += unit.apMax;
        this.maintCost += unit.maintCost;
        return this;
    }

    getInfo(): string {
        return `${this.name} 所属国家: ${this.nationId} 招募费用: ${this.cost} 生产力花费: ${this.recruitProcessMax} 行动力: ${this.ap}/${this.apMax} 维护费用: ${this.maintCost}`;
    }
}