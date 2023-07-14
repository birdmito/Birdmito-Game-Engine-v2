import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { PathFinding } from "./PathFinding";
import { Province } from "./Province";
import { generateTip } from "./Tip";
import { UnitBehaviour } from "./UnitBehaviour";

export class BotNationActMode {
    constructor(nation: Nation) {
        this.nation = nation;
    }
    //对其他国家发来的求和请求的接受度
    acceptPeaceRequest: Map<number, number> = new Map();


    isBotOperateFinish: boolean = false;
    nation: Nation;
    operatedObjectList: Array<Province | UnitBehaviour> = [];
    objectIndex: number = -1;
    timesOfSameOperateIndex: number = 0;  //同一个操作对象操作的次数

    lastActTime = Date.now();

    updateOperatedObjectList() {
        this.lastActTime = Date.now();
        console.log(`电脑帝国${this.nation.nationId}正在更新操作对象列表`)
        this.operatedObjectList = [];
        this.objectIndex = -1;
        //遍历所有单位
        for (const unit of this.nation.unitList) {
            this.operatedObjectList.push(unit);
        }
        //遍历所有领地
        for (const province of this.nation.cityList) {
            this.operatedObjectList.push(province);
        }
    }

    botAct() {
        generateTip(Province.provincesObj[0][0].getBehaviour(Province), "电脑帝国正在行动")
        if (this.objectIndex === -1) {
            //若没有正在研究的科技，则随机选择一个科技
            if (this.nation.currentTechName === "") {
                const randomTech = this.nation.randomTechList[Math.floor(Math.random() * this.nation.randomTechList.length)];
                this.nation.currentTechName = randomTech.techName;
            }
            //只有在当前城市数量接近城市上限时才尝试升级政府
            if ((this.nation.cityMax - this.nation.cityList.length) < 3) {
                console.log(`电脑帝国${this.nation.nationId}正在尝试升级政府`)
                this.nation.upgrade();
            }
            this.objectIndex++;
        }


        if (this.objectIndex >= this.operatedObjectList.length) {
            console.log(`电脑帝国${this.nation.nationId}操作完毕`)
            this.isBotOperateFinish = true;
        }

        const operatedObject = this.operatedObjectList[this.objectIndex];

        //若操作对象是单位
        if (operatedObject instanceof UnitBehaviour) {
            console.log(`电脑帝国${this.nation.nationId}正在操作第${this.objectIndex + 1}个对象${operatedObject.unitParam.name}`);
            if (Date.now() - this.lastActTime < 500) {
                console.log(`电脑帝国${this.nation.nationId}正在等待操作间隔，进度：${Date.now() - this.lastActTime}/1000`)
                return;
            }
            else {
                //开拓者行为
                if (operatedObject.unitParam.name === '开拓者') {
                    if (operatedObject.currentProvince.nationId === 0) {
                        //若所在领地未被占领，则开拓
                        console.log(`%c电脑帝国${this.nation.nationId}正在开拓`, 'color: red')
                        operatedObject.act();
                        this.operateNext();
                    }
                    //若所在领地已被占领，在重复操作该单位小于3次的情况下，随机移动
                    else if (this.timesOfSameOperateIndex < 3) {
                        console.log(`%c电脑帝国${this.nation.nationId}正在移动开拓者单位`, 'color: red')
                        //若所在领地已被占领，则向周围领地移动
                        const provinceList = operatedObject.currentProvince.getAdjacentProvinces();
                        //若周围领地均被占领，则随机移动
                        const randomProvince = provinceList[Math.floor(Math.random() * provinceList.length)];
                        operatedObject.moveToProvince(randomProvince)
                        this.operateThis();
                    }
                    else {
                        this.operateNext();
                    }
                }
                else if (operatedObject.unitParam.name === '筑城者') {
                    //若所在领地已被开拓，则筑城
                    if (operatedObject.currentProvince.nationId === this.nation.nationId && operatedObject.currentProvince.isCity === false) {
                        console.log(`%c电脑帝国${this.nation.nationId}正在筑城`, 'color: red')
                        operatedObject.act();
                        this.operateNext();
                    }
                    else if (this.timesOfSameOperateIndex < 3 && this.nation.provinceOwnedList.filter(province => province.isCity === false).length > 0) {
                        console.log(`%c电脑帝国${this.nation.nationId}正在移动筑城者单位`, 'color: red')
                        //在已拥有且未筑城的省份中随机抽取一个
                        const provinceList = this.nation.provinceOwnedList.filter(province => province.isCity === false);
                        const randomProvince = provinceList[Math.floor(Math.random() * provinceList.length)];
                        console.log(`下一步路径：${PathFinding.noobFindPath(operatedObject.currentProvince, randomProvince)}`)
                        const nextProvince = PathFinding.noobFindPath(operatedObject.currentProvince, randomProvince) ?
                            PathFinding.noobFindPath(operatedObject.currentProvince, randomProvince) : operatedObject.currentProvince;
                        operatedObject.moveToProvince(nextProvince);
                        this.operateThis();

                        // if (provinceList.some(province => province.nationId === this.nation.nationId && province.isCity === false)) {
                        //     //若周围有符合条件的领地，则移动至该领地
                        //     const randomProvince = provinceList.filter(province => province.nationId === this.nation.nationId
                        //         && province.isCity === false)[Math.floor(Math.random() * provinceList.length)];
                        //     operatedObject.moveToProvince(randomProvince)
                        //     this.operateThis();
                        // }
                        // else {
                        //     //若周围领地均不符合条件，则随机移动
                        //     const randomProvince = provinceList[Math.floor(Math.random() * provinceList.length)];
                        //     operatedObject.moveToProvince(randomProvince)
                        //     this.operateThis();
                        // }
                    }
                    else {
                        this.operateNext();
                    }
                }
                else {
                    this.operateNext();
                }
            }
        }

        //若操作对象是领地
        else if (operatedObject instanceof Province) {
            console.log(`电脑帝国${this.nation.nationId}正在操作第${this.objectIndex + 1}个对象${operatedObject.provinceName}`);
            var isOperateFinish = true;
            //若预计收入大于0
            if (this.nation.doraChangeNextTurn > 0) {
                //若省份有兵营，则随机招募单位
                if (operatedObject.buildingList.some(building => building.name === '兵营')) {
                    console.log(`%c电脑帝国${this.nation.nationId}正在招募单位`, 'color: red')
                    //没有敌人的情况下
                    if (this.nation.enemyNationList.length === 0) {
                        //若拥有省份数量大于城市数量，且城市数量小于城市数量上限，则优先招募筑城者
                        if (this.nation.provinceOwnedList.length > this.nation.cityList.length && this.nation.cityList.length < this.nation.cityMax) {
                            this.nation.recruitUnit(operatedObject, '筑城者');
                        }
                        else {
                            this.nation.recruitUnit(operatedObject, '开拓者');
                        }
                    }
                    //有敌人的情况下
                    else {
                        //优先招募士兵
                        this.nation.recruitUnit(operatedObject, '士兵');
                    }
                }

                //建造建筑
                console.log(`%c电脑帝国${this.nation.nationId}正在建造建筑`, 'color: red')
                if (this.nation.doraChangeNextTurn < 250) {
                    //优先建造金矿
                    isOperateFinish = this.nation.buildBuilding(operatedObject, '金矿');
                }
                else if (this.nation.doraChangeNextTurn < 500) {
                    //其次建造兵营
                    isOperateFinish = this.nation.buildBuilding(operatedObject, '兵营');
                    if (!isOperateFinish) {
                        isOperateFinish = this.nation.buildBuilding(operatedObject, '大学');
                    }
                }
                else {
                    isOperateFinish = this.nation.buildBuilding(operatedObject, '兵营');
                    if (!isOperateFinish) {
                        const randomNum = Math.random() * 2;
                        if (randomNum < 1) {
                            isOperateFinish = this.nation.buildBuilding(operatedObject, '大学');
                        }
                        else {
                            isOperateFinish = this.nation.buildBuilding(operatedObject, '工厂');
                        }
                    }
                }
            }
            else {
                isOperateFinish = this.nation.buildBuilding(operatedObject, '金矿');
            }

            if (!isOperateFinish && this.timesOfSameOperateIndex < 3) {
                this.operateThis();
            }
            else {
                this.operateNext();
            }
        }
    }

    operateNext() {
        this.lastActTime = Date.now();
        console.log(`电脑帝国${this.nation.nationId}正在操作下一个对象`)
        this.objectIndex++;
        this.timesOfSameOperateIndex = 0;
        this.botAct();
    }

    operateThis() {
        this.lastActTime = Date.now();
        console.log(`电脑帝国${this.nation.nationId}正在重复操作该对象`)
        this.timesOfSameOperateIndex++;
        this.botAct();
    }
}
