import { Structure } from "ts-morph";
import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { infoShowable } from "./infoShowable";


export class Technology implements infoShowable {
    //OPTIMIZE 
    static allTechList: Technology[] = [
        new Technology("探秘奥坎之径", [], 100, "殖民所需的金钱-10%", [-0.1]),
        new Technology("我来我见我征服", ["探秘奥坎之径"], 200, "城市控制上限基础值+3", [3]),
        new Technology("科技第一生产力", ["探秘奥坎之径"], 200, "解锁科技所需的科技点-10%", [-0.1]),
        new Technology("劳动资源统合", ["我来我见我征服"], 300, "城市控制上限翻倍"),
        new Technology("政府规模升级", ["我来我见我征服"], 300, "升级政府等级所需的金钱-10%", [-0.1]),
        new Technology("劳动力再升级", ["我来我见我征服"], 300, "开拓者的生产所需的生产力-20%", [-0.2]),
        new Technology("科技再生产", ["科技第一生产力"], 200, "此后，每研究一项科技，当前拥有的地块基础产出+1", [0]),
        new Technology("战火狂潮之道", [], 100, "单位招募金钱花费-10%", [-0.1]),
        new Technology("下岗士兵再就业", ["战火狂潮之道"], 200, "招募单位所需的生产力-10%", [-0.1]),
        new Technology("配置士兵开拓车", ["战火狂潮之道"], 200),
        new Technology("先进自走火炮", ["下岗士兵再就业"], 300),
        new Technology("优势火力学说", ["下岗士兵再就业"], 300),
        new Technology("配置飞行装置", ["配置士兵开拓车"], 300),
        new Technology("配置秘源护盾", ["配置士兵开拓车"], 300),
        new Technology("奇迹工坊之路", [], 100, "建筑花费-10%", [-0.1]),
        // new Technology("秘源驱动机械", ["奇迹工坊之路"], 200),
        // new Technology("发掘秘源之金", ["奇迹工坊之路"], 200),
        // new Technology("机械飞升", ["秘源驱动机械"], 300),
        // new Technology("新型机械工业", ["秘源驱动机械", "发掘秘源之金"], 300),
        // new Technology("浪淘尽现黄金", ["发掘秘源之金"], 300),
        // new Technology("秘源金销全国", ["发掘秘源之金"], 300),
        // new Technology("秘源金再升级", ["发掘秘源之金"], 300),
        // new Technology("幻影通讯之径", [], 100),
        // new Technology("开发通讯仪器", ["幻影通讯之径"], 200),
        // new Technology("翻译各族文字", ["幻影通讯之径"], 200),
        // new Technology("城邦经济契约", ["开发通讯仪器", "翻译各族文字"], 300),
    ];

    static getNationTechByName(nationId: number, techName: string): Technology {
        for (let i = 0; i < Nation.nations[nationId].techTree.length; i++) {
            if (Nation.nations[nationId].techTree[i].techName == techName) {
                return Nation.nations[nationId].techTree[i];
            }
        }
        console.warn("未找到科技：" + techName);
        return null;
    }

    static getOriginTechByName(techName: string): Technology {
        for (let i = 0; i < Technology.allTechList.length; i++) {
            if (Technology.allTechList[i].techName == techName) {
                return Technology.allTechList[i];
            }
        }
        console.warn("未找到科技：" + techName);
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
