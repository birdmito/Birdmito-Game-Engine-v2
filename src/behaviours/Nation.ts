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
        this.currentTech = '农业';
    }
    nationId: number = 1;  //1-玩家 >2-AI
    nationName: string = "玩家";

    dora: number = 0;
    techPerTurn: number = 0;
    level: number = 1;

    techTree: Technology[] = Technology.copyAllTechList();
    currentTech: string = '农业'
}

// export class NationManager{
//     //国家
//     static nationQuantity = 2;
//     static nationList: Nation[] = [
//     ];
// }
