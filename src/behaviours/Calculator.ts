import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
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
        var tech = Technology.getTechByName(nationId, "探秘奥坎之径");
        if (tech.techProcess >= tech.techProcessMax) {
            bonus += tech.techEffectValueList[0];
        }
        //检测该国家是否解锁了科技"奇迹工坊之路"
        tech = Technology.getTechByName(nationId, "奇迹工坊之路");
        if (tech.techProcess >= tech.techProcessMax) {
            bonus += tech.techEffectValueList[0];
        }
        const result = baseCost * bonus;
        console.log("殖民所需要的金币数：" + result);
        return result;
    }
}
