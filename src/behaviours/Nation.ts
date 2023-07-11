import { TextRange } from "ts-morph";
import { GameObject } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { BotNationActMode } from "./BotNationActMode";
import { Building } from "./Building";
import { Calculator } from "./Calculator";
import { ProductingItem } from "./ProductingItem";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { Technology } from "./Technology";
import { generateTip } from "./Tip";
import { UnitBehaviour } from "./UnitBehaviour";
import { UnitParam } from "./UnitParam";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";


export class Nation {
    static nationQuantity = 3;
    static nations: Nation[] = [];

    constructor(nationId: number = 1, nationName: string = "玩家", product: number = 0, level: number = 1) {
        this.nationId = nationId;
        this.nationName = nationName;
        this.dora = product;
        this.level = level;
        this.techTree = Technology.copyAllTechList();
        this.techPerTurn = 0;
        this.currentTechName = '';
        this.provinceOwnedList = new Array<Province>();
        this.capitalProvince = undefined;
        this.cityMax = 5;
        this.upgradeCost = 100;
        this.botActMode = new BotNationActMode(this);
        for (let i = 0; i < Nation.nationQuantity; i++) {
            this.favorability.set(i + 1, 0);  //默认中立
            this.foreignPolicy.set(i + 1, 'neutral');  //默认中立
        }
    }
    botActMode: BotNationActMode = undefined;

    nationId: number = 1;  //1-玩家 >2-AI
    nationName: string = "玩家";

    dora: number = 0;
    techPerTurn: number = 0;
    level: number = 1;
    upgradeCost: number = 0;
    cityMax: number = 5;

    techTree: Technology[] = Technology.copyAllTechList();
    currentTechName: string = '探秘奥坎之径'
    randomTechList: Technology[] = [];

    favorability: Map<number, number> = new Map<number, number>();  //对其他国家的好感度
    foreignPolicy: Map<number, 'positive' | 'negative' | 'neutral'> = new Map<number, 'positive' | 'negative' | 'neutral'>();  //对其他国家的外交政策 
    enemyNationList: Nation[] = [];  //正在与该国家交战的国家

    declareWar(nation: Nation) {
        this.enemyNationList.push(nation);
    }
    peace(nation: Nation) {
        this.enemyNationList.splice(this.enemyNationList.indexOf(nation), 1);
    }
    changeForeignPolicy(nation: Nation, policy: 'positive' | 'negative' | 'neutral') {
        const oldPolicy = this.foreignPolicy.get(nation.nationId);
        this.foreignPolicy.set(nation.nationId, policy);
        if ((oldPolicy === 'positive' || 'negative') && policy == 'neutral') {
            this.doraChangeNextTurn -= 15;
        }
        if (oldPolicy === 'neutral' && (policy == 'positive' || 'negative')) {
            this.doraChangeNextTurn -= 15;
        }
    }

    provinceOwnedList: Province[] = [];
    _capitalProvince: Province;
    set capitalProvince(value: Province) {
        if (this._capitalProvince)
            this._capitalProvince.gameObject.getChildById('_CapitalText').getBehaviour(TextRenderer).text = ' ';
        this._capitalProvince = value;
        if (this._capitalProvince)
            this._capitalProvince.gameObject.getChildById('_CapitalText').getBehaviour(TextRenderer).text = '★';
    }
    get capitalProvince(): Province {
        return this._capitalProvince;
    }
    cityList: Province[] = [];

    unitList: UnitBehaviour[] = [];  //国家拥有的所有单位

    doraChangeNextTurn: number = 0;  //预计的dora变动

    //TODO 收支明细——没想好怎么做（明细更新的时机）
    // //记录收支细节，用于在ui中展示
    // //预计的dora变动
    // _doraChangeNextTurn: number = 0;
    // get doraChangeNextTurn(): number {
    //     return this._doraChangeNextTurn;
    // }
    // set doraChangeNextTurn(value: number) {
    //     const old = this._doraChangeNextTurn;
    //     this._doraChangeNextTurn = value;
    //     console.log(`${this.nationName}预计下回合dora变动：${old} -> ${value}`);
    // }

    // doraDetail: ValueDetail = new ValueDetail();
    // addDoraDetail(value: number, reason: string) {
    //     if (value > 0) {
    //         this.doraDetail.addIncome(value, reason);
    //     }
    //     else {
    //         this.doraDetail.addOutcome(value, reason);
    //     }
    // }

    getRandomTechNameList(): Technology[] {
        //遍历玩家可研究且未完成的科技，并从中随机抽取至多三个
        const techList = this.getAvailableTech();
        const techListRandom: Technology[] = [];
        let randomTechNum = 3;
        if (techList.length <= randomTechNum) {
            return techList //当可选科技数量小于3时，抽取全部科技
        }

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
                const preTech = Technology.getNationTechByName(this.nationId, preTechName);
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

    //在指定省份建造指定建筑
    buildBuilding(province: Province, buildingName: string): boolean {
        const newBuilding = Building.copyBuilding(Building.getProvinceBuildingByName(province, buildingName))

        if (newBuilding.isUniqueInProvince &&
            (province.buildingList.some(building => building.name === newBuilding.name) || province.productQueue.some(item => item.productName === newBuilding.name))) {
            console.log("建筑：" + newBuilding.name + "在同一省份中只能建造一次");
            if (this.nationId === GameProcess.playerNationId)
                generateTip(province, "建筑：" + newBuilding.name + "在同一省份中只能建造一次");
            return false;
        }
        //生产队列最多有5个
        if (province.productQueue.length >= 5) {
            console.log("生产队列最多只能有5个单位或建筑");
            if (this.nationId === GameProcess.playerNationId) {
                generateTip(province, "生产队列最多只能有5个单位或建筑");
            }
            return;
        }
        //省份最多有10个建筑
        const buildingNumIncludingQueue = province.buildingList.length + province.productQueue.filter(item => item.productType === 'building').length;
        if (buildingNumIncludingQueue >= 10) {
            console.log("省份最多只能建造10个建筑");
            if (this.nationId === GameProcess.playerNationId)
                generateTip(province, "省份最多只能建造10个建筑");
            return false;
        }
        //判断金币数
        if (this.dora < newBuilding.cost) {
            console.log("金币不足");
            if (this.nationId === GameProcess.playerNationId)
                generateTip(province, "金币不足");
            return false;
        }
        //判断秘源金矿
        if (newBuilding.name === '秘源金矿') {
            if (province.mountainPercent < 0.5) {
                console.log("秘源金矿只能建在山地上");
                if (this.nationId === GameProcess.playerNationId)
                    generateTip(province, "秘源金矿只能建在山地上");
                return false;
            }
            if (!Technology.isTechCompleted(this.nationId, "发掘秘源之金")) {
                console.log("只应被AI触发的console：需要发掘秘源之金");
                return false;
            }
        }
        //判断秘源精炼厂
        if (newBuilding.name === '秘源精炼厂') {
            if (!province.buildingList.some(building => building.name === '秘源金矿')) {
                console.log("秘源精炼厂需要建造在秘源金矿上");
                if (this.nationId === GameProcess.playerNationId)
                    generateTip(province, "秘源精炼厂需要建造在秘源金矿上");
                return false;
            }
        }
        //判断机械工业厂
        if (newBuilding.name === '机械工业厂') {
            if (!Technology.isTechCompleted(this.nationId, "新型机械工业")) {
                console.log("只应被AI触发的console：需要新型机械工业");
                return false;
            }
        }
        //判断贸易站
        if (newBuilding.name === '贸易站') {
            if (!Technology.isTechCompleted(this.nationId, "贸易站")) {
                console.log("只应被AI触发的console：需要贸易站");
                return false;
            }
        }


        //向生产队列中push item
        province.productQueue.push(new ProductingItem(newBuilding.name, newBuilding.productProcessMax, 'building'));
        this.dora -= newBuilding.cost;

        return true;
    }

    //在指定身份招募单位
    recruitUnit(province: Province, unitName: string) {
        const newUnit = UnitParam.copyUnitParam(UnitParam.getProvinceUnitParamByName(province, unitName));
        if (this.dora < newUnit.cost) {
            console.log("金币不足");
            if (this.nationId === GameProcess.playerNationId) {
                generateTip(province, "金币不足");
            }
            return;
        }
        //生产队列最多有5个
        if (province.productQueue.length >= 5) {
            console.log("生产队列最多只能有5个单位或建筑");
            if (this.nationId === GameProcess.playerNationId) {
                generateTip(province, "生产队列最多只能有5个单位或建筑");
            }
            return;
        }
        //判断自走火炮
        if (newUnit.name === '自走火炮') {
            if (!Technology.isTechCompleted(this.nationId, "先进自走火炮")) {
                console.log("只应被AI触发的console：需要自走火炮");
                return;
            }
        }

        //向生产队列中push item
        province.productQueue.push(new ProductingItem(newUnit.name, newUnit.recruitProcessMax, 'unit'));
        this.dora -= newUnit.cost;
    }

    updateNationProperties() {
        //更新最大城市数
        this.cityMax = Calculator.calculateCityMax(this);

        //更新升级所需多拉
        this.upgradeCost = Calculator.calculateUpgradeCost(this);

        //更新所有单位属性
        for (let j = 0; j < this.unitList.length; j++) {
            const unit = this.unitList[j];
            // unit.updateUnitParam()
        }
    }

    upgrade() {
        //判断金币数
        if (this.dora >= this.upgradeCost) {
            this.level++;
            this.dora -= this.upgradeCost;
            console.log("升级成功" + this.level);
            this.updateNationProperties();
        }
        else {
            console.log("金币不足");
            if (this.nationId === GameProcess.playerNationId)
                generateTip(this.provinceOwnedList[0], "金币不足");
        }
    }

}
// export class NationManager{
//     //国家
//     static nationQuantity = 2;
//     static nationList: Nation[] = [
//     ];
// }