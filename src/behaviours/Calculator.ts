import { Behaviour } from "../engine/Behaviour";
import { Building } from "./Building";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { Technology } from "./Technology";
import { UnitParam } from "./UnitParam";

export class Calculator {
    //计算殖民所需要的金币数
    static calculateColonyCost(nationId, targetCoord: { x: number, y: number }) {
        //基础值
        var baseCost = 100;
        //加成区
        var bonus = 1;
        if (Nation.nations[nationId].capitalProvinceCoord !== undefined) {
            //根据距离计算金币数
            var distance = Math.abs(targetCoord.x - Nation.nations[nationId].capitalProvinceCoord.x) +
                Math.abs(targetCoord.y - Nation.nations[nationId].capitalProvinceCoord.y);
            baseCost += distance * 10;
        }
        //探秘奥坎之径：殖民所需的金钱-10%
        bonus += Technology.getTechBonus(nationId, "探秘奥坎之径");
        const result = baseCost * bonus;
        console.log("殖民所需要的金币数：" + result);
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

    static calculateProvinceProduction(province: Province) {
        //来自地形的产出
        province.provinceProduction.dora = 5 + province.plainPercent * 10 + province.lakePercent * 20 + province.forestPercent * 10;
        province.provinceProduction.production = 5 + province.plainPercent * 5 + province.lakePercent * 20 + province.forestPercent * 15;
        province.provinceProduction.techPoint = 0;

        //来自建筑的产出
        var buildingProductionSum: Resource = new Resource(0, 0, 0);
        for (const building of province.buildingList) {
            buildingProductionSum.add(building.buildingProduction);
        }
        province.provinceProduction.add(buildingProductionSum);

        //来自科技的产出
        //科技再生产：此后，每研究一项科技，当前拥有的地块基础产出+1
        const techBonus = Technology.getTechBonus(province.nationId, "科技再生产");
        province.provinceProduction.add(new Resource(techBonus, techBonus, techBonus));

        //取整
        province.provinceProduction.floor();
    }

    static calculateProvinceUnitParam(province: Province) {
        //更新在该省份招募的单位的参数
        const unitList = province.recruitableUnitList
        for (let i = 0; i < unitList.length; i++) {
            const base = UnitParam.getOriginUnitParamByName(unitList[i].name);
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

    static calculateProvinceBuildingParam(province: Province) {
        console.log("计算建筑参数")
        //更新在该省份建造的建筑的参数
        const buildableBuildingList = province.buildableBuildingList;
        for (let i = 0; i < buildableBuildingList.length; i++) {
            const base = Building.getOriginBuildingByName(province, buildableBuildingList[i].name);
            var bonus = Building.getBuildingWhichAllParamIsOne();

            //奇迹工坊之路：建筑花费-10%
            bonus.cost += Technology.getTechBonus(province.nationId, "奇迹工坊之路");
            base.multiplyBuildingParam(bonus);
            console.log("计算后建筑花费" + base.cost)
            buildableBuildingList[i] = base;
        }
    }
}
