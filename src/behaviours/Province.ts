import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { GameProcess } from "../behaviours/GameProcess";

export class Province extends Behaviour {
    nationId = 0;
    isOwnable = true;
    apCost = 5;
    production = 5;

    plainPercent = 1;
    lakePercent = 0;
    forestPercent = 0;
    mountainPercent = 0;

    onStart(): void {
        console.log("province start");
        this.changeNationId(0);
        this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTTransparent.png';
    }

    onUpdate(): void {
        // console.log("province" + this.nationId + this.gameObject.children[1].getBehaviour(BitmapRenderer).source)
    }

    changeNationId(nationId: number) {
        this.nationId = nationId;
        this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTColor.png';
    }

    updateApCost(apCostPlused: number = 0) {
        this.apCost = 5 + this.lakePercent * 10 + this.forestPercent * 5 + this.mountainPercent * 20 + apCostPlused;
    }

    updateProduction(productionPlused: number = 0) {
        this.production = 5 + this.plainPercent * 10 + this.lakePercent * 5 + this.forestPercent * 20 + productionPlused;
    }

    giveOwnerProduction() {
        if (this.nationId > 0) {
            GameProcess.nationList[this.nationId].money += this.production;
        }
    }
}


// 1. Province：地块属性——Behavior
//   1. nationId 阵营归属：number
//     1. 0 代表无归属（野地），1 为玩家，2 及以上代表 AI，每个数字都是一个 AI 的 ID
//   2. + isOwnable 是否能被占领（陆地-海洋）:boolean
//     1. 是否可走，是否包含地貌
//   3. apCost 单位到达该地块所需行动点：number
//   4. production 地块产出的资源（金币）: number
//   5. + landscape 地貌（湖泊-平原-森林-山地）：bool * 4
//     1. 在 onStart 中根据该属性来计算行动点和产出资源