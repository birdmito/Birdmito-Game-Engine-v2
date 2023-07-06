import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Building } from "./Building";
import { Calculator } from "./Calculator";
import { ProductingItem } from "./ProductingItem";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { Technology } from "./Technology";
import { generateTip } from "./Tip";
import { UnitParam } from "./UnitParam";


export class Nation {
    static nationQuantity = 2;
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
        this.capitalProvinceCoord = undefined;
        this.cityMax = 5;
        this.upgradeCost = 100;
    }
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

    provinceOwnedList: Province[] = [];
    capitalProvinceCoord: { x: number, y: number };
    cityList: Province[] = [];

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
    buildBuilding(province: Province, buildingName: string) {
        const newBuilding = Building.copyBuilding(Building.getProvinceBuildingByName(province, buildingName))

        if (newBuilding.isUniqueInProvince &&
            (province.buildingList.some(building => building.name === newBuilding.name) || province.productQueue.some(item => item.productName === newBuilding.name))) {
            console.log("建筑：" + newBuilding.name + "在同一省份中只能建造一次");
            if (this.nationId === 1)
                generateTip(province, "建筑：" + newBuilding.name + "在同一省份中只能建造一次");
            return;
        }
        //省份最多有10个建筑
        if (province.buildingList.length >= 10) {
            console.log("省份最多只能建造10个建筑");
            if (this.nationId === 1)
                generateTip(province, "省份最多只能建造10个建筑");
            return;
        }
        //判断金币数
        if (this.dora < newBuilding.cost) {
            console.log("金币不足");
            if (this.nationId === 1)
                generateTip(province, "金币不足");
            return;
        }

        //向生产队列中push item
        province.productQueue.push(new ProductingItem(newBuilding.name, newBuilding.productProcessMax, 'building'));
        this.dora -= newBuilding.cost;
    }

    //在指定身份招募单位
    recruitUnit(province: Province, unitName: string) {
        const newUnit = UnitParam.copyUnitParam(UnitParam.getProvinceUnitParamByName(province, unitName));
        if (this.dora < newUnit.cost) {
            console.log("金币不足");
            if (this.nationId === 1) {
                generateTip(province, "金币不足");
            }
            return;
        }

        //向生产队列中push item
        province.productQueue.push(new ProductingItem(newUnit.name, newUnit.recruitProcessMax, 'unit'));
        this.dora -= newUnit.cost;
    }


    static updateNation() {
        for (let i = 1; i < Nation.nations.length - 1; i++) {
            const nation = Nation.nations[i];
            //更新当前研究进度
            const currentTech = Technology.getNationTechByName(nation.nationId, nation.currentTechName);
            if (nation.currentTechName) {
                currentTech.techProcess += nation.techPerTurn;
                if (currentTech.techProcess >= currentTech.techProcessMax) {
                    currentTech.techProcess = currentTech.techProcessMax;
                    console.log(nation.currentTechName + "研究完成");
                    nation.currentTechName = "";
                    nation.randomTechList = nation.getRandomTechNameList();

                    //研究完成后，若有科技再生产科技，则增加现有地块的产出加成+1
                    if (Technology.isTechCompleted(nation.nationId, "科技再生产")) {
                        Technology.getNationTechByName(nation.nationId, "科技再生产").techEffectValueList[0] += 1;
                        const bonusFromTech = Technology.getTechBonus(nation.nationId, "科技再生产");
                        console.log(bonusFromTech);
                    }
                }

                //更新最大城市数
                nation.cityMax = Calculator.calculateCityMax(nation);

                //更新科技树科技研究所需点数
                for (let j = 0; j < nation.techTree.length; j++) {
                    const tech = nation.techTree[j];
                    tech.techProcessMax = Calculator.calculateTechProcessMax(nation, tech);
                }

                //更新升级所需多拉
                nation.upgradeCost = Calculator.calculateUpgradeCost(nation);
            }
        }
    }
}
// export class NationManager{
//     //国家
//     static nationQuantity = 2;
//     static nationList: Nation[] = [
//     ];
// }