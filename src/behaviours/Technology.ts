import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { infoShowable } from "./infoShowable";

export class Technology implements infoShowable {
    static allTechList: Technology[] = [
        new Technology("探秘奥坎之径", [], 100),
        new Technology("我来我见我征服", ["探秘奥坎之径"], 200),
        new Technology("科技第一生产力", ["探秘奥坎之径"], 200),
        new Technology("劳动资源统合", ["我来我见我征服"], 300),
        new Technology("政府规模升级", ["我来我见我征服"], 300),
        new Technology("劳动力再升级", ["我来我见我征服"], 300),
        new Technology("我来我见我征服", ["探秘奥坎之径"], 200),
        new Technology("我来我见我征服", ["探秘奥坎之径"], 200),
        new Technology("我来我见我征服", ["探秘奥坎之径"], 200),
        new Technology("战火狂潮之道", [], 100),
        new Technology("下岗士兵再就业", ["战火狂潮之道"], 200),
        new Technology("配置士兵开拓车", ["战火狂潮之道"], 200),
        new Technology("先进自走火炮", ["下岗士兵再就业"], 300),
        new Technology("优势火力学说", ["下岗士兵再就业"], 300),
        new Technology("配置飞行装置", ["配置士兵开拓车"], 300),
        new Technology("配置秘源护盾", ["配置士兵开拓车"], 300),
        new Technology("奇迹工坊之路", [], 100),
        new Technology("秘源驱动机械", ["奇迹工坊之路"], 200),
        new Technology("发掘秘源之金", ["奇迹工坊之路"], 200),
        new Technology("机械飞升", ["秘源驱动机械"], 300),
        new Technology("新型机械工业", ["秘源驱动机械", "发掘秘源之金"], 300),
        new Technology("浪淘尽现黄金", ["发掘秘源之金"], 300),
        new Technology("秘源金销全国", ["发掘秘源之金"], 300),
        new Technology("秘源金再升级", ["发掘秘源之金"], 300),
        new Technology("幻影通讯之径", [], 100),
        new Technology("开发通讯仪器", ["幻影通讯之径"], 200),
        new Technology("翻译各族文字", ["幻影通讯之径"], 200),
        new Technology("城邦经济契约", ["开发通讯仪器", "翻译各族文字"], 300),
    ];

    static getTechByName(nationId: number, techName: string): Technology {
        for (let i = 0; i < Nation.nationList[nationId].techTree.length; i++) {
            if (Nation.nationList[nationId].techTree[i].techName == techName) {
                return Nation.nationList[nationId].techTree[i];
            }
        }
        alert("未找到科技：" + techName);
        return null;
    }

    static copyAllTechList(): Technology[] {
        let techList: Technology[] = [];
        for (let i = 0; i < Technology.allTechList.length; i++) {
            techList.push(Technology.allTechList[i]);
        }
        return techList;
    }

    static getAvailableTech(nationId: number): Technology[] {
        let techList: Technology[] = [];
        for (let i = 0; i < Nation.nationList[nationId].techTree.length; i++) {
            var isAvailable = true;
            let tech = Nation.nationList[nationId].techTree[i];
            for (const preTech of tech.preTech) {
                if (this.getTechByName(nationId, preTech).techProcess < this.getTechByName(nationId, preTech).techProcessMax) {
                    isAvailable = false;
                    break;
                }
            }
            if (isAvailable) {
                techList.push(tech);
            }
        }
        return techList;
    }

    private constructor(techName: string, preTech: string[], techProcessMax: number) {
        this.techName = techName;
        this.preTech = preTech;
        this.techProcessMax = techProcessMax;
    }

    //科技名称
    techName: string = "科技";
    //前置科技
    preTech: string[] = [];
    //科技研究进度
    techProcess: number = 0;
    //科技研究所需进度
    techProcessMax: number = 100;

    getInfo(): string {
        return this.techName + " " + this.techProcess + "/" + this.techProcessMax;
    }
}
