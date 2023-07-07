import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { GameProcess } from "../behaviours/GameProcess";
import { GameObject, getGameObjectById } from "../engine";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { UnitBehaviour } from "./UnitBehaviour";
import { Nation } from "./Nation";
import { Building } from "./Building";
import { Resource } from "./Resource";
import { ProductingItem } from "./ProductingItem";
import { UnitPrefabBinding } from "../bindings/UnitPrefabBinding";
import { Binding } from "../bindings/Binding";
import { UnitParam } from "./UnitParam";
import { Calculator } from "./Calculator";

export class Province extends Behaviour {
    static provinces: GameObject[][] = [];
    static updateProvince() {
        //每回合开始时，所有领地给予所属国家产出
        for (let i = 0; i < Province.provinces.length; i++) {
            for (let j = 0; j < Province.provinces[i].length; j++) {
                const province = Province.provinces[i][j].getBehaviour(Province);
                province.updateProduction();  //更新领地产出
                province.giveOwnerProduction();  //给予所属国家产出
                province.updateProductProcess();  //更新生产队列
            }
        }
    }

    coord: { x: number, y: number } = { x: 0, y: 0 };

    nationId = 0;
    isOwnable = true;
    apCost = 1;
    provinceProduction: Resource = new Resource(0, 0, 0);
    provinceProductionBonus: Resource = new Resource(0, 0, 0);

    plainPercent = 0;
    lakePercent = 0;
    forestPercent = 0;
    mountainPercent = 0;

    buildingList: Building[] = [];

    isCity: boolean = false;


    //可建造的建筑列表
    buildableBuildingList: Building[] = Building.allBuildingList;

    //可招募的单位
    recruitableList: UnitParam[] = UnitParam.allUnitParamList;

    //生产队列
    productQueue: ProductingItem[] = [];

    //残留生产力
    productionLeft: number = 0;

    onStart(): void {
        // console.log("province start");
        this.changeNationId(0);
        // this.randomLandscape();
        this.updateApCost();
        this.updateProduction();
        this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTTransparent.png';
    }

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log("province is clicked")
            if (getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).selectedBehaviour instanceof UnitBehaviour) {
                const soilder = getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).selectedBehaviour as UnitBehaviour;
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
        //改变领地所属国家
        this.nationId = nationId;
        this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTColor.png';
        if (nationId > 0) {
            Nation.nations[nationId].provinceOwnedList.push(this);
            if (Nation.nations[nationId].capitalProvinceCoord === undefined) {
                Nation.nations[nationId].capitalProvinceCoord = this.coord;  //将首个被占领的领地设为首都
                console.log("capitalProvinceCoord", Nation.nations[nationId].capitalProvinceCoord);
            }
        }
    }

    updateApCost(apCostPlused: number = 0) {
        //更新行动力消耗
        this.apCost = 1 + this.lakePercent * 5 + this.forestPercent * 2 + this.mountainPercent * 10 + apCostPlused;
        this.apCost = Math.floor(this.apCost);
    }

    updateProduction() {
        //更新省份产出
        Calculator.calculateProvinceProduction(this);
    }

    giveOwnerProduction() {
        // console.log("giveOwnerProduction")
        //给予所属国家产出
        if (this.nationId > 0) {
            Nation.nations[this.nationId].dora += this.provinceProduction.dora;
            Nation.nations[this.nationId].techPerTurn += this.provinceProduction.techPoint;
        }
    }

    updateProductProcess() {
        //推进生产队列
        // console.log("updateProductProcess");
        const currentItem = this.productQueue[0];
        if (this.productQueue.length > 0) {
            currentItem.productProcess += this.provinceProduction.production + this.productionLeft;
            this.productionLeft = 0;
        }

        //生产完成
        if (this.productQueue.length > 0 && currentItem.productProcess >= currentItem.productProcessMax) {
            this.productionLeft = currentItem.productProcess - currentItem.productProcessMax;  //残留生产力
            this.productQueue.shift();
            if (currentItem.productType == 'building') {
                const newBuilding = Building.copyBuilding(Building.getBuildingByName(currentItem.productName));
                this.buildingList.push(newBuilding);
                this.updateProduction();
            }
            else if (currentItem.productType == 'unit') {
                const newUnitParam = UnitParam.copyUnitParam(UnitParam.getUnitParamByName(currentItem.productName), 1);
                const newUnitPrefab = this.engine.createPrefab(new UnitPrefabBinding());
                const prefabBehavior = newUnitPrefab.getBehaviour(UnitBehaviour);
                prefabBehavior.unitParam = newUnitParam;
                prefabBehavior.soidlerCoor = this.coord;
                getGameObjectById("UnitRoot").addChild(newUnitPrefab);
            }
            else {
                console.log("无法识别的生产类型")
            }
        }
    }

    becomeCity(): void {
        //升级为城市
        this.isCity = true;
        Nation.nations[this.nationId].cityList.push(this);
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