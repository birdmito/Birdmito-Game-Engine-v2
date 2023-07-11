import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Building } from "./Building";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { Technology } from "./Technology";
import { UnitBehaviour } from "./UnitBehaviour";
import { UnitParam } from "./UnitParam";

export class Calculator {
    //计算殖民所需要的金币数
    static calculateColonyCost(nationId, targetCoord: { x: number, y: number }) {
        //基础值
        var baseCost = 100;
        //加成区
        var bonus = 1;
        if (Nation.nations[nationId].capitalProvince !== undefined) {
            //根据距离计算金币数
            var distance = Math.abs(targetCoord.x - Nation.nations[nationId].capitalProvince.coord.x) +
                Math.abs(targetCoord.y - Nation.nations[nationId].capitalProvince.coord.y);
            baseCost += distance * 10;
        }
        //探秘奥坎之径：殖民所需的金钱-10%
        bonus += Technology.getTechBonus(nationId, "探秘奥坎之径");
        const result = baseCost * bonus;
        return result;
    }

    //计算城市上线
    static calculateCityMax(nation: Nation) {
        var cityMax = 5 + nation.level * 2;
        //我来我见我征服：城市控制上限基础值+3
        cityMax += Technology.getTechBonus(nation.nationId, "我来我见我征服");
        //劳动资源统合：城市控制上限翻倍
        if (Technology.isTechCompleted(nation.nationId, "劳动资源统合")) {
            cityMax *= 2;
        }
        console.log("城市上限：" + cityMax);
        return cityMax;
    }

    //计算科技所需科研点
    static calculateTechProcessMax(nation: Nation, tech: Technology): number {
        const base = Technology.getOriginTechByName(tech.techName).techProcessMax;
        var bonus = 1;
        bonus += Technology.getTechBonus(nation.nationId, "科技第一生产力");
        console.log("bonus:" + bonus);
        const result = Math.floor(base * bonus);
        return result;
    }

    //计算升级政府所需金币数
    static calculateUpgradeCost(nation): number {
        const base = 100 + nation.level * 50;
        var bonus = 1;
        bonus += Technology.getTechBonus(nation.nationId, "政府规模升级");
        const result = Math.floor(base * bonus);
        return result;
    }

    //计算省份产出
    static calculateProvinceProduction(province: Province) {
        var result = new Resource(0, 0, 0);
        //来自地形的产出
        result.dora = 5 + province.plainPercent * 10 + province.lakePercent * 20 + province.forestPercent * 10;
        result.production = 5 + province.plainPercent * 5 + province.lakePercent * 20 + province.forestPercent * 15;
        result.techPoint = 0;

        var pluser = new Resource(0, 0, 0);
        var multiplier = new Resource(1, 1, 1);

        //来自建筑的产出
        for (const building of province.buildingList) {
            pluser.add(building.buildingProduction);
            if (building.name === "秘源金矿") {
                //秘源金矿：金钱产出+40%
                multiplier.dora += Technology.getTechBonus(province.nationId, "秘源金矿");
            }
            if (building.name === "贸易站") {
                //贸易站：当相邻的地块同时拥有“贸易站”时，该省份金币产出+5
                for (const neighbour of province.getAdjacentProvinces()) {
                    if (neighbour.buildingList.find((building) => building.name === "贸易站") !== undefined) {
                        pluser.dora += 5;
                    }
                }
            }
        }

        //来自科技的产出
        //科技再生产：此后，每研究一项科技，当前拥有的地块基础产出+1
        const techBonus = Technology.getTechBonus(province.nationId, "科技再生产");
        pluser.add(new Resource(techBonus, techBonus, techBonus));
        //秘源驱动机械：省份生产力产出+10%
        multiplier.production += Technology.getTechBonus(province.nationId, "秘源驱动机械");
        //浪淘尽现黄金：省份金钱产出+1
        pluser.dora += Technology.getTechBonus(province.nationId, "浪淘尽现黄金");

        result.add(pluser);
        result.multiply(multiplier);

        //取整
        result.floor();

        province.provinceProduction = result;
    }

    /**该函数只更新招募单位时的参数，单位招募完成后的参数不存在此处计算*/
    static calculateProvinceUnitParam(province: Province) {
        //更新在该省份招募的单位的参数
        const unitList = province.recruitableUnitList
        for (let i = 0; i < unitList.length; i++) {
            const base = UnitParam.copyUnitParam(UnitParam.getOriginUnitParamByName(unitList[i].name));
            var bonus = UnitParam.getUnitParamWhichAllParamIsOne();

            //劳动力再升级：生产筑城者所需的生产力-20%
            if (unitList[i].name === "开拓者") {
                bonus.recruitProcessMax += Technology.getTechBonus(province.nationId, "劳动力再升级");
            }

            //战火狂潮之道：单位招募金钱花费-10%
            bonus.cost += Technology.getTechBonus(province.nationId, "战火狂潮之道");

            //下岗士兵再就业：单位招募生产力花费-10%
            bonus.recruitProcessMax += Technology.getTechBonus(province.nationId, "下岗士兵再就业");

            base.multiplyUnitParam(bonus);
            unitList[i] = base;
        }
    }

    //每回合调用一次，计算单位的参数
    static calculateUnitPerTurn(unit: UnitBehaviour) {
        this.calculateUnitInstant(unit);
        unit.unitParam.ap = unit.unitParam.apMax;
    }

    //即时生效，计算单位的参数
    static calculateUnitInstant(unit: UnitBehaviour) {
        var result: UnitParam = unit.unitParamWhenRecruited;
        var pluser = UnitParam.getUnitParamWhichAllParamIsZero();
        var multiplier = UnitParam.getUnitParamWhichAllParamIsOne();

        //配置士兵开拓车：所有士兵行动力上限+3
        pluser.apMax += Technology.getTechBonus(unit.nationId, "配置士兵开拓车");
        //彻查士兵档案:所有士兵维护费用-20%
        multiplier.maintCost += Technology.getTechBonus(unit.nationId, "彻查士兵档案");
        //先进机械装配：所有士兵行动力上限+1
        pluser.apMax += Technology.getTechBonus(unit.nationId, "先进机械装配");

        result.addUnitParam(pluser);
        result.multiplyUnitParam(multiplier);
        console.log("计算和平状态下单位的信息")
        unit.unitParam = result;
    }


    static calculateProvinceBuildingParam(province: Province) {
        console.log("计算建筑参数")
        //更新在该省份建造的建筑的参数
        const buildableBuildingList = province.buildableBuildingList;
        for (let i = 0; i < buildableBuildingList.length; i++) {
            var result = Building.copyBuilding(Building.getOriginBuildingByName(province, buildableBuildingList[i].name));
            var pluser = Building.getBuildingWhichAllParamIsZero();
            var multiplier = Building.getBuildingWhichAllParamIsOne();

            //奇迹工坊之路：建筑花费-10%
            multiplier.cost += Technology.getTechBonus(province.nationId, "奇迹工坊之路");

            //全民机械浪潮：建筑额外提供2生产力
            pluser.buildingProduction.production += Technology.getTechBonus(province.nationId, "全民机械浪潮");

            result.addBuildingParam(pluser);
            result.multiplyBuildingParam(multiplier);
            buildableBuildingList[i] = result;
        }
        //已建造的建筑
        const buildingList = province.buildingList;
        for (let i = 0; i < buildingList.length; i++) {
            buildingList[i] = Building.copyBuilding(Building.getProvinceBuildingByName(province, buildingList[i].name));
        }
    }

    static calculateUnitGroupPower(unit: UnitBehaviour) {
        //计算单位的战斗力
        var result = 0;
        var pluser = 0;
        var multiplier = 1;

        //计算基础战斗力
        result += unit.unitParam.power * unit.unitParam.quantity;
        //先进作战机械：单位战斗力+10%
        multiplier += Technology.getTechBonus(unit.nationId, "先进作战机械");

        unit.power = result;

    }
}
