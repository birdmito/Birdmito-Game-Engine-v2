import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { GameProcess } from "../behaviours/GameProcess";
import { getGameObjectById } from "../engine";
import { UI_selectedProvinceInfoPrefabBinding } from "../bindings/UI_selectedProvinceInfoPrefabBinding";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Soilder } from "./Soilder";

export class Province extends Behaviour {
    coord: { x: number, y: number } = { x: 0, y: 0 };

    nationId = 0;
    isOwnable = true;
    apCost = 1;
    production = 5;

    plainPercent = 0;
    lakePercent = 0;
    forestPercent = 0;
    mountainPercent = 0;

    onStart(): void {
        console.log("province start");
        this.changeNationId(0);
        this.randomLandscape();
        this.updateApCost();
        this.updateProduction();
        this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTTransparent.png';
    }

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("province is clicked")
            if (getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).selectedBehaviour instanceof Soilder) {
                const soilder = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).selectedBehaviour as Soilder;
                soilder.moveToProvince(this);
            }
            getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).showSelectedObjectInfo(this);
        }
    }

    //随机生成地貌
    randomLandscape() {
        var randomNum = Math.floor(Math.random() * 100) / 100;
        this.plainPercent = randomNum;
        randomNum = Math.floor(Math.random() * (1 - this.plainPercent) * 100) / 100;
        this.forestPercent = randomNum;
        randomNum = Math.floor(Math.random() * (1 - this.plainPercent - this.forestPercent) * 100) / 100;
        this.lakePercent = randomNum;
        this.mountainPercent = 1 - this.plainPercent - this.lakePercent - this.forestPercent;
        //根据最大地貌设置地块图片
        const maxPercent = Math.max(this.plainPercent, this.lakePercent, this.forestPercent, this.mountainPercent);
        switch (maxPercent) {
            case this.plainPercent:
                this.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainPlain.png';
                break;
            case this.lakePercent:
                this.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainLake.png';
                break;
            case this.forestPercent:
                this.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainForest.png';
                break;
            case this.mountainPercent:
                this.gameObject.children[0].getBehaviour(BitmapRenderer).source = './assets/images/Map_TerrainMountain.png';
                break;
        }
    }

    changeNationId(nationId: number) {
        this.nationId = nationId;
        this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTColor.png';
    }

    updateApCost(apCostPlused: number = 0) {
        this.apCost = 1 + this.lakePercent * 5 + this.forestPercent * 2 + this.mountainPercent * 10 + apCostPlused;
        this.apCost = Math.floor(this.apCost);
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