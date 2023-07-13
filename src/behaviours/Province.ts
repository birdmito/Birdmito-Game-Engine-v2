import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { GameProcess } from "../behaviours/GameProcess";
import { GameObject, getBehaviourClassByName, getGameObjectById } from "../engine";
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
import { ProvinceGenerator } from "./ProvinceGenerator";
import { Battle } from "./BattleHandler";
import { TextRenderer } from "../engine/TextRenderer";
import { HexagonBorderRenderer } from "../engine/HexagonBorderRenderer";
import { Transform } from "../engine/Transform";
import { Click } from "./Click";
import { HexagonLine } from "./HexagonLine";
import { UI_UpdateSelectedObjInfo } from "./UI_UpdateSelectedObjInfo";
import { PathFinding } from "./PathFinding";

export class Province extends Behaviour {
    static provincesObj: GameObject[][] = [];

    coord: { x: number, y: number } = { x: 0, y: 0 };

    nationId = 0;

    isOwnable = true;
    apCost = 1;

    private _provinceProduction: Resource = undefined;
    get provinceProduction(): Resource {
        return this._provinceProduction;
    }

    /**在更新该属性时一定要直接赋值，不要修改其内部属性，否则会导致预计的dora变动出错*/
    set provinceProduction(value: Resource) {
        const oldValue = this._provinceProduction;
        this._provinceProduction = value;
        if (this.nationId !== 0) {
            Nation.nations[this.nationId].doraChangeNextTurn += value.dora - oldValue.dora  //更新预计的dora变动
        }
    }
    provinceName: string = "未命名";

    plainPercent = 0;
    lakePercent = 0;
    forestPercent = 0;
    mountainPercent = 0;

    buildingList: Building[] = [];
    unitList: UnitBehaviour[] = [];
    battle: Battle = undefined;

    isCity: boolean = false;


    //可建造的建筑列表
    buildableBuildingList: Building[] = Building.copyOriginBuildingList();

    //可招募的单位
    recruitableUnitList: UnitParam[] = UnitParam.copyOriginUnitParamList(this.nationId);

    //生产队列
    productQueue: ProductingItem[] = [];

    //残留生产力
    productionLeft: number = 0;

    onStart(): void {
        // console.log("province start");
        this.changeNationId(0);
        // this.randomLandscape();
        this.updateProvinceProperties();
        this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTTransparent.png';
    }

    onUpdate(): void {
        this.gameObject.onMouseEnter = () => {
            if (SelectedObjectInfoMangaer.selectedBehaviour instanceof UnitBehaviour) {
                const unit = SelectedObjectInfoMangaer.selectedBehaviour as UnitBehaviour;
                if ((unit.nationId === GameProcess.playerNationId || GameProcess.isCheat)) {
                    //清空之前的路径
                    if (unit.path) {
                        for (let i = 0; i < unit.path.length; i++) {
                            const pathNoText = unit.path[i].gameObject.getChildById("_PathNoText").getBehaviour(TextRenderer);
                            pathNoText.text = " ";
                        }
                    }
                    unit.path = []

                    unit.path = PathFinding.findPath(unit.currentProvince, this);
                    unit.apCostToMove = 0;
                    //按顺序设置每个省份gameObject上_PathNoText的text
                    if (unit.path) {
                        for (let i = 0; i < unit.path.length; i++) {
                            const pathNoText = unit.path[i].gameObject.getChildById("_PathNoText").getBehaviour(TextRenderer);
                            pathNoText.text = i.toString();
                            unit.apCostToMove += unit.path[i].apCost;
                        }
                    }
                }
            }
        }
        this.gameObject.onMouseLeftDown = () => {
            console.log("province is clicked")
            SelectedObjectInfoMangaer.showSelectedObjectInfo(this);
        }
        this.gameObject.onMouseRightDown = () => {
            if (SelectedObjectInfoMangaer.selectedBehaviour instanceof UnitBehaviour) {
                console.log("selected is unit, move to province")
                //若当前选中的是单位，则移动
                const unit = SelectedObjectInfoMangaer.selectedBehaviour as UnitBehaviour;
                if ((unit.nationId === GameProcess.playerNationId || GameProcess.isCheat)) {
                    unit.moveToProvince(this);
                }
            }
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
        // if (nationId !== 0) {
        //     Nation.nations[nationId].doraChangeNextTurn += this.provinceProduction.dora;  //更新预计的dora变动
        // }
        //若领地原本有主，从原主的领地列表中删除
        if (this.nationId > 0) {
            Nation.nations[this.nationId].provinceOwnedList.splice(Nation.nations[this.nationId].provinceOwnedList.indexOf(this), 1);
            if (this.isCity) {
                Nation.nations[this.nationId].cityList.splice(Nation.nations[this.nationId].cityList.indexOf(this), 1);
            }
        }
        this.nationId = nationId;
        // this.gameObject.children[1].getBehaviour(BitmapRenderer).source = './assets/images/TESTColor.png';
        if (nationId > 0) {
            Nation.nations[nationId].provinceOwnedList.push(this);
            if (Nation.nations[nationId].capitalProvince === undefined) {
                Nation.nations[nationId].capitalProvince = this;  //将首个被占领的领地设为首都
                console.log("capitalProvinceCoord", Nation.nations[nationId].capitalProvince);
            }
            if (this.isCity) {
                Nation.nations[nationId].cityList.push(this);
            }
            HexagonLine.reDrawBorderLine(); //重绘边界线
        }
    }

    /**每回合调用一次 */
    updateApCost(apCostPlused: number = 0) {
        //更新行动力消耗
        this.apCost = 1 + this.lakePercent * 5 + this.forestPercent * 2 + this.mountainPercent * 10 + apCostPlused;
        this.apCost = Math.floor(this.apCost);
    }

    /**随时可调用 */
    updateProvinceProperties() {
        //更新领地属性
        //被招募单位的属性
        Calculator.calculateProvinceUnitParam(this);
        //若省份已被筑城，则更新被建造建筑的属性
        if (this.isCity) {
            Calculator.calculateProvinceBuildingParam(this);
        }
        //产出
        Calculator.calculateProvinceProduction(this);
    }

    /**每回合调用一次 */
    giveOwnerTechPoint() {
        // console.log("giveOwnerProduction")
        //给予所属国家产出
        if (this.nationId > 0) {
            Nation.nations[this.nationId].techPerTurn += this.provinceProduction.techPoint;
        }
    }

    /**每回合调用一次 */
    updateProductProcessPerTurn() {
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
                const newBuilding = Building.copyBuilding(Building.getProvinceBuildingByName(this, currentItem.productName));
                this.buildingList.push(newBuilding);
                this.updateProvinceProperties();
            }
            else if (currentItem.productType == 'unit') {
                //获取单位参数
                const newUnitParam = UnitParam.copyUnitParam(UnitParam.getProvinceUnitParamByName(this, currentItem.productName));
                //生成单位
                const newUnitPrefab = this.engine.createPrefab(new UnitPrefabBinding());
                //配置单位属性
                const prefabBehavior = newUnitPrefab.getBehaviour(UnitBehaviour);
                prefabBehavior.nationId = this.nationId;
                prefabBehavior.unitParam = newUnitParam;
                prefabBehavior.unitCoor = this.coord;
                //添加到场景中
                getGameObjectById("UnitRoot").addChild(newUnitPrefab);
            }
            else {
                console.log("无法识别的生产类型")
            }
        }

        //若当前选中项为Province，则更新其UI
        if (SelectedObjectInfoMangaer.selectedBehaviour === this) {
            const window = SelectedObjectInfoMangaer.selectedInfoWindow
            window.getBehaviour(UI_UpdateSelectedObjInfo).updateSelectedProvinceBuildingListUI();
            window.getBehaviour(UI_UpdateSelectedObjInfo).updateSelectedProvinceProductQueueUI();
        }
    }

    becomeCity(): void {
        //升级为城市
        this.isCity = true;
        Nation.nations[this.nationId].cityList.push(this);
    }

    //获取相邻领地
    getAdjacentProvinces(): Province[] {
        const adjacentProvinces: Province[] = [];
        const adjacentCoords = ProvinceGenerator.getAdjacentCoords(this.coord.x, this.coord.y);
        for (const coord of adjacentCoords) {
            if (coord.x >= 0 && coord.x < Province.provincesObj.length && coord.y >= 0 && coord.y < Province.provincesObj[0].length) {
                const adjacentProvince = Province.provincesObj[coord.x][coord.y];
                if (adjacentProvince !== undefined) {
                    adjacentProvinces.push(adjacentProvince.getBehaviour(Province));
                }
            }
        }
        return adjacentProvinces;
    }

    //获得两块领地之间的距离
    getDistanceToProvince(province: Province): number {
        return Math.abs(this.coord.x - province.coord.x) + Math.abs(this.coord.y - province.coord.y);
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