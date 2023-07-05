import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Technology } from "./Technology";


export class Nation {
    static nationQuantity = 2;
    static nationList: Nation[] = [];

    constructor(nationId: number = 1, nationName: string = "玩家", product: number = 0, level: number = 1) {
        this.nationId = nationId;
        this.nationName = nationName;
        this.dora = product;
        this.level = level;
        this.techTree = Technology.copyAllTechList();
        this.techPerTurn = 0;
        this.currentTechName = '探秘奥坎之径';
        this.provinceOwnedCoordList = new Array<{ x: number, y: number }>();
    }
    nationId: number = 1;  //1-玩家 >2-AI
    nationName: string = "玩家";

    dora: number = 0;
    techPerTurn: number = 0;
    level: number = 1;

    techTree: Technology[] = Technology.copyAllTechList();
    currentTechName: string = '探秘奥坎之径'
    randomTechList: Technology[] = [];

    provinceOwnedCoordList: { x: number, y: number }[] = [];
    //Nation.nationList[1].provinceOwnedCoordList 玩家所拥有的所有地块列表

    getRandomTechNameList(): Technology[] {
        //遍历玩家可研究且未完成的科技，并从中随机抽取三个
        const techList = this.getAvailableTech();
        const techListRandom: Technology[] = [];

        //不重复的抽取三个科技
        while (techListRandom.length < 3) {
            const random = Math.floor(Math.random() * techList.length);
            if (!techListRandom.includes(techList[random])) {
                techListRandom.push(techList[random]);
            }
        }
        return techListRandom;
    }

    getAvailableTech(): Technology[] {
        let techList: Technology[] = [];
        for (let i = 0; i < this.techTree.length; i++) {
            var isAvailable = true;
            let tech = this.techTree[i];
            //如果科技已经完成，或者前置科技未完成，则不可用
            if (tech.techProcess >= tech.techProcessMax) {
                isAvailable = false;
            }
            for (const preTechName of tech.preTechName) {
                const preTech = Technology.getTechByName(this.nationId, preTechName);
                if (preTech.techProcess < preTech.techProcessMax) {
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
}

// export class NationManager{
//     //国家
//     static nationQuantity = 2;
//     static nationList: Nation[] = [
//     ];
// }
