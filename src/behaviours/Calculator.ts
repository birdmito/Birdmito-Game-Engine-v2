import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { Technology } from "./Technology";

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
        //检测该国家是否解锁了科技"探秘奥坎之径"
        bonus += Technology.getTechBonus(nationId, "探秘奥坎之径");
        //检测该国家是否解锁了科技"奇迹工坊之路"
        bonus += Technology.getTechBonus(nationId, "奇迹工坊之路");
        const result = baseCost * bonus;
        console.log("殖民所需要的金币数：" + result);
        return result;
    }

    static calculateCityMax(nation: Nation) {
        var cityMax = 5 + nation.level * 2;
        //检测该国家是否解锁了科技"我来我见我征服";
        cityMax += Technology.getTechBonus(nation.nationId, "我来我见我征服");
        //检测该国家是否解锁了科技"劳动资源统合";
        if (Technology.isTechCompleted(nation.nationId, "劳动资源统合")) {
            cityMax *= 2;
        }
        console.log("城市上限：" + cityMax);
        return cityMax;
    }

    static calculateTechProcessMax(nation: Nation, tech: Technology): number {
        const base = Technology.getOriginTechByName(tech.techName).techProcessMax;
        var bonus = 1;
        bonus += Technology.getTechBonus(nation.nationId, "科技第一生产力");
        console.log("bonus:" + bonus);
        const result = Math.floor(base * bonus);
        return result;
    }

    static calculateUpgradeCost(nation): number {
        const base = 100 + nation.level * 50;
        var bonus = 1;
        bonus += Technology.getTechBonus(nation.nationId, "政府规模升级");
        //检测该国家是否解锁了科技"奇迹工坊之路"
        bonus += Technology.getTechBonus(nation.nationId, "奇迹工坊之路");
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

        //总产出
        province.provinceProduction.add(province.provinceProductionBonus);

        province.provinceProduction.add(buildingProductionSum);  //总产出
        province.provinceProduction.floor();

    }
}
