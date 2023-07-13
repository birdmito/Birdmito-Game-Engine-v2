import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";
import { Resource } from "./Resource";
import { infoShowable } from "./infoShowable";

export class Building implements infoShowable {
    private constructor(name, cost = 10, productProcessMax: number = 3, production: Resource = new Resource,
        maintCost: Resource = new Resource, isUniqueInProvince = false, techRequired = '') {
        this.name = name;
        this.cost = cost;
        this.productProcessMax = productProcessMax;
        this.maintCost = maintCost;
        this.buildingProduction = production;
        this.isUniqueInProvince = isUniqueInProvince;
        this.techRequired = techRequired;
        // console.log("Building " + name + " is created");
        // console.log(this)
    }
    static originBuildingList: Building[] = [
        new Building('铸金厂', 380, 30, new Resource(85, 0, 0), new Resource(35, 0, 0), false),
        new Building('工厂', 250, 30, new Resource(0, 25, 0), new Resource(30, 0, 0), false),
        new Building('兵营', 300, 50, new Resource(0, 0, 0), new Resource(50, 0, 0), true),
        new Building('大学', 300, 50, new Resource(0, 0, 15), new Resource(50, 0, 0), false),
        new Building('秘源金矿', 500, 50, new Resource(0, 0, 0), new Resource(50, 0, 0), true, "发掘秘源之金"),
        new Building('机械工业厂', 300, 50, new Resource(0, 15, 0), new Resource(30, 0, 0), true, "新型机械工业"),
        new Building('贸易站', 200, 50, new Resource(0, 0, 0), new Resource(0, 0, 0), true, "秘源金销全国"),
        new Building('秘源精炼厂', 200, 50, new Resource(2, 2, 0), new Resource(0, 0, 0), false, "秘源金再升级")
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

    //需要科技解锁
    techRequired: string;


    addBuildingParam(building: Building): void {
        this.cost += building.cost;
        this.productProcessMax += building.productProcessMax;
        this.buildingProduction.add(building.buildingProduction);
        this.maintCost.add(building.maintCost);
    }

    multiplyBuildingParam(building: Building): void {
        this.cost *= building.cost;
        this.productProcessMax *= building.productProcessMax;
        this.buildingProduction.multiply(building.buildingProduction);
        this.maintCost.multiply(building.maintCost);
    }

    /**获取一个所有参数都为1的建筑，用于在Calculator中计算*/
    static getBuildingWhichAllParamIsOne(): Building {
        return new Building('这是一段不应该被看到的文本', 1, 1, new Resource(1, 1, 1), new Resource(1, 1, 1), false);
    }


    /**获取一个所有参数都为0的建筑，用于在Calculator中计算*/
    static getBuildingWhichAllParamIsZero(): Building {
        return new Building('这是一段不应该被看到的文本', 0, 0, new Resource(0, 0, 0), new Resource(0, 0, 0), false);
    }

    /**获取目标省份可建造建筑列表中的目标建筑（属性已经过修正）*/
    static getProvinceBuildingByName(province: Province, name: string): Building {
        if (province.buildableBuildingList.find(building => building.name === name)) {
            return province.buildableBuildingList.find(building => building.name === name);
        }
        console.log("error: no building named " + name);
        return null;
    }

    static getOriginBuildingByName(province: Province, name: string): Building {
        if (this.originBuildingList.find(building => building.name === name)) {
            return this.originBuildingList.find(building => building.name === name);
        }
        console.log("error: no building named " + name);
        return null;
    }

    static copyOriginBuildingList(): Building[] {
        const copyBuildingList: Building[] = [];
        for (const building of Building.originBuildingList) {
            copyBuildingList.push(new Building(building.name, building.cost, building.productProcessMax, building.buildingProduction, building.maintCost, building.isUniqueInProvince, building.techRequired));
        }
        return copyBuildingList;
    }

    static copyBuilding(building: Building): Building {
        return new Building(building.name, building.cost, building.productProcessMax, building.buildingProduction, building.maintCost, building.isUniqueInProvince, building.techRequired);
    }

    getInfo(): string {
        var info = this.name + '    ' + '建造费用：' + this.cost + '奥坎盾   ' + '生产力花费：' + this.productProcessMax + '|产出：';
        const production = this.buildingProduction;
        if (production.dora === 0 && production.production === 0 && production.techPoint === 0) {
            info += '无';
        } else {
            if (production.dora > 0) {
                info += production.dora + '奥坎盾';
            }
            if (production.production > 0) {
                info += production.production + '生产力';
            }
            if (production.techPoint > 0) {
                info += production.techPoint + '科技点';
            }
        }
        const maintCost = this.maintCost;
        if (maintCost.dora > 0) {
            info += '    维护费：' + maintCost.dora + '奥坎盾';
        }
        return info;
    }
}