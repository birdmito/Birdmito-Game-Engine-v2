import { Behaviour } from "../engine/Behaviour";
import { Province } from "./Province";

export class Building {
    constructor(name, type: 'money' = 'money', cost = 10, buildTime = 1, production = 5) {
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.production = production;
        this.buildTime = buildTime;
        this.buildTimeLeft = buildTime;
        console.log("Building " + name + " is created");
        console.log(this)
    }
    //建筑名称
    name: string = '金矿';
    //建筑类型
    type: 'money' = 'money';
    //建筑花费
    cost = 10;
    //建成所需回合数
    buildTime = 1;
    //建成剩余回合数
    buildTimeLeft = 1;
    //建筑产出
    production = 5;
    //建筑状态
    status: 'building' | 'finished' = 'building';
}