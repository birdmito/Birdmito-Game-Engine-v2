import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";

export class Technology {
    static allTechList: Technology[] = [
        new Technology("农业", [], 100),
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
}
