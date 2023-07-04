import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { infoShowable } from "./infoShowable";

export class Building implements infoShowable {
    private constructor(name, cost = 10, productProcessMax: number = 3, production: Resource = new Resource, maintCost: Resource = new Resource, isUniqueInProvince = false) {
        this.name = name;
        this.cost = cost;
        this.productProcessMax = productProcessMax;
        this.maintCost = maintCost;
        this.buildingProduction = production;
        this.isUniqueInProvince = isUniqueInProvince;
        console.log("Building " + name + " is created");
        console.log(this)
    }
    static allBuildingList: Building[] = [
        new Building('金矿', 10, 30, new Resource(5, 0, 0), new Resource(2, 0, 0), false),
        new Building('兵营', 50, 50, new Resource(0, 0, 0), new Resource(5, 0, 0), true),
    ];

    //建筑名称
    name: string = '金矿';
    //建筑花费
    cost = 10;

    //所需生产力
    productProcessMax = 3;

    //建筑产出
    buildingProduction: Resource;

    //是否在省份中唯一
    isUniqueInProvince = false;

    //维护费
    maintCost: Resource;


    static getBuildingByName(name: string): Building {
        if (Building.allBuildingList.find(building => building.name === name)) {
            return Building.allBuildingList.find(building => building.name === name);
        }
        console.log("error: no building named " + name);
        return null;
    }

    static copyBuilding(building: Building): Building {
        return new Building(building.name, building.cost, building.productProcessMax, building.buildingProduction, building.maintCost, building.isUniqueInProvince);
    }

    getInfo(): string {
        var info = this.name + '\n' + '建造费用：' + this.cost + '\n' + '生产力花费：' + this.productProcessMax;
        const production = this.buildingProduction;
        if (production.dora > 0) {
            info += '\n' + production.dora + '多拉';
        }
        if (production.production > 0) {
            info += '\n' + production.production + '生产力';
        }
        if (production.techPoint > 0) {
            info += '\n' + production.techPoint + '科技点';
        }
        const maintCost = this.maintCost;
        if (maintCost.dora > 0) {
            info += '\n' + '维护费' + maintCost.dora + '多拉';
        }

        return info;
    }
}