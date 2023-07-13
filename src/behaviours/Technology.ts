import { Structure } from "ts-morph";
import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { infoShowable } from "./infoShowable";


export class Technology implements infoShowable {
    static allTechList: Technology[] = [
        new Technology("探秘奥坎之径", [], 100, "殖民所需的金钱-10%", [-0.1]),
        new Technology("我来我见我征服", ["探秘奥坎之径"], 200, "城市控制上限基础值+3", [3]),
        new Technology("科技第一生产力", ["探秘奥坎之径"], 200, "解锁科技所需的科技点-10%", [-0.1]),
        new Technology("征服星辰大海", ["探秘奥坎之径"], 200, "你的单位可以踏入海洋"),
        new Technology("劳动资源统合", ["探秘奥坎之径","我来我见我征服"], 300, "城市控制上限翻倍"),
        new Technology("政府规模升级", ["探秘奥坎之径","我来我见我征服"], 300, "升级政府等级所需的金钱-10%", [-0.1]),
        new Technology("劳动力再升级", ["探秘奥坎之径","我来我见我征服"], 300, "开拓者的生产所需的生产力-20%", [-0.2]),
        new Technology("科技再生产", ["探秘奥坎之径","科技第一生产力"], 200, "此后，每研究一项科技，当前拥有的地块基础产出+1", [0]),
        new Technology("战火狂潮之道", [], 100, "单位招募金钱花费-10%", [-0.1]),
        new Technology("下岗士兵再就业", ["战火狂潮之道"], 200, "招募单位所需的生产力-10%", [-0.1]),
        new Technology("配置士兵开拓车", ["战火狂潮之道"], 200, "所有士兵行动力上限+3", [3]),
        new Technology("先进作战机械", ["战火狂潮之道"], 200, "士兵战斗力提高+10%", [0.1]),
        new Technology("小兵团作战", ["战火狂潮之道","下岗士兵再就业"], 300),
        new Technology("彻查士兵档案", ["战火狂潮之道","下岗士兵再就业"], 300, "单位维护费-20%", [-0.2]),
        new Technology("配置飞行装置", ["战火狂潮之道","配置士兵开拓车"], 300),
        new Technology("配置秘源护盾", ["战火狂潮之道","配置士兵开拓车"], 300, "战斗中所受伤害-10%", [-0.1]),
        new Technology("先进自走火炮", ["战火狂潮之道","先进作战机械"], 300, "解锁新兵种【自走火炮】：当该单位处于战斗状态时，使该场战斗你的所有骰子+1", [1]),
        new Technology("先进机械装配", ["战火狂潮之道","先进作战机械"], 300, "士兵行动AP+1，触发战斗时，战斗骰子+1", [1, 1]),
        new Technology("奇迹工坊之路", [], 100, "建筑花费-10%", [-0.1]),
        new Technology("秘源驱动机械", ["奇迹工坊之路"], 200, "所有省份生产力+10%", [0.1]),
        new Technology("发掘秘源之金", ["奇迹工坊之路"], 200, " 解锁新建筑【秘源金矿】：地块金币产出增加+40%（每个省份仅能建立一个）", [0.4]),
        new Technology("全民机械浪潮", ["奇迹工坊之路","秘源驱动机械"], 300, "城市中的建筑现在将额外提供2点生产力", [2]),
        new Technology("新型机械工业", ["奇迹工坊之路","秘源驱动机械", "发掘秘源之金"], 300, "解锁新建筑【机械工业厂】：该建筑产出15点生产力（每个省份仅能建立一个）"),
        new Technology("浪淘尽现黄金", ["奇迹工坊之路","发掘秘源之金"], 300, "当前控制的所有地块金币产出+1", [1]),
        new Technology("秘源金销全国", ["奇迹工坊之路","发掘秘源之金"], 300, "解锁新建筑【贸易站】：当相邻的地块同时拥有【贸易站】时，该省份金币产出+5", [5]),
        new Technology("秘源金再升级", ["奇迹工坊之路","发掘秘源之金"], 300, "解锁新建筑【秘源精炼厂】：仅可在有“秘源金矿”的地块建造，在提供金币产出+2的同时，生产力+2", [1]),
    ];

    static getNationTechByName(nationId: number, techName: string): Technology {
        for (let i = 0; i < Nation.nations[nationId].techTree.length; i++) {
            if (Nation.nations[nationId].techTree[i].techName == techName) {
                // console.log("找到国家" + nationId + "的科技：" + techName);
                return Nation.nations[nationId].techTree[i];
            }
        }
        // console.warn("未找到科技：" + techName);
        return null;
    }

    static getOriginTechByName(techName: string): Technology {
        for (let i = 0; i < Technology.allTechList.length; i++) {
            if (Technology.allTechList[i].techName == techName) {
                return Technology.allTechList[i];
            }
        }
        // console.warn("未找到科技：" + techName);
        return null;
    }

    static getTechBonus(nationId: number, techName: string, valueIndex = 0): number {
        if (nationId == 0) {
            return 0;
        }
        let tech = Technology.getNationTechByName(nationId, techName);
        if (tech == null || tech.techProcess < tech.techProcessMax) {
            return 0;
        }
        return tech.techEffectValueList[valueIndex];
    }

    static isTechCompleted(nationId: number, techName: string): boolean {
        let tech = Technology.getNationTechByName(nationId, techName);
        if (tech == null) {
            return false;
        }
        return tech.techProcess >= tech.techProcessMax;
    }

    static copyAllTechList(): Technology[] {
        let techList: Technology[] = [];
        for (let i = 0; i < Technology.allTechList.length; i++) {
            techList.push(new Technology(Technology.allTechList[i].techName, Technology.allTechList[i].preTechName, Technology.allTechList[i].techProcessMax, Technology.allTechList[i].techEffect, Technology.allTechList[i].techEffectValueList));
        }
        return techList;
    }

    private constructor(techName: string, preTech: string[], techProcessMax: number, techEffect: string = '该科技尚未设置效果描述', valueList: number[] = []) {
        this.techName = techName;
        this.preTechName = preTech;
        this.techProcessMax = techProcessMax;
        this.techEffect = techEffect;
        this.techEffectValueList = valueList;
    }

    //科技名称
    techName: string = "科技";
    //前置科技
    preTechName: string[] = [];
    //科技研究进度
    techProcess: number = 0;
    //科技研究所需进度
    techProcessMax: number = 100;
    //科技效果描述
    techEffect: string = "科技效果";
    //科技增幅数值列表
    techEffectValueList: number[] = [];

    getInfo(): string {
        return this.techName + " " + this.techProcess + "/" + this.techProcessMax + " " + this.techEffect;
    }
}
