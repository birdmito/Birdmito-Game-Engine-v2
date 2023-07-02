import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";


class Nation {
    constructor(nationId: number = 1, nationName: string = "玩家", money: number = 0, level: number = 1) {
        this.nationId = nationId;
        this.nationName = nationName;
        this.money = money;
        this.level = level;
    }
    nationId: number = 1;  //1-玩家 >2-AI
    nationName: string = "玩家";

    money: number = 0;
    level: number = 1;
}

export class NationManager{
    //国家
    static nationQuantity = 2;
    static nationList: Nation[] = [
    ];
}
