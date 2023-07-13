import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_UnitActButton } from "./UI_UnitActButton";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Province } from "./Province";
import { N } from "vitest/dist/types-2b1c412e";
import { UnitParam as UnitParam } from "./UnitParam";
import { Nation } from "./Nation";
import { generateTip } from "./Tip";
import { Moveable } from "./Moveable";
import { Calculator } from "./Calculator";
import { Battle, BattleHandler } from "./BattleHandler";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcess } from "./GameProcess";
import { UI_BattleInfoButton } from "./UI_BattleInfoButton";
import { UI_BattleInfoButtonPrefabBinding } from "../bindings/UI_BattleInfoButtonPrefabBinding";
import { b2QueryCallback } from "@flyover/box2d";
import { Building } from "./Building";

export class UnitBehaviour extends Behaviour implements Moveable {
    nationId: number;
    unitCoor: { x: number, y: number } = { x: 1, y: 0 };
    currentProvince = Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province);
    unitParamWhenRecruited: UnitParam;

    power;
    isInCombat: boolean = false;

    indexInProcince: number = 0;

    //存储移动时省份路径的栈
    apCostToMove: number = 0;

    private _unitParam: UnitParam = UnitParam.originUnitParamList[0];
    get unitParam(): UnitParam {
        return this._unitParam;
    }
    /**在更新该属性时一定要直接赋值，不要修改其内部属性，否则会导致预计的dora变动出错*/
    set unitParam(value: UnitParam) {
        const oldUnitParam = this._unitParam;
        this._unitParam = value;
        Nation.nations[this.nationId].doraChangeNextTurn += (oldUnitParam.maintCost - value.maintCost) * this.unitParam.quantity;  //更新预计的dora变动
    }

    onStart(): void {
        console.log(`单位生成 所属国家${this.nationId} 所属领地坐标 ${this.unitCoor.x} ${this.unitCoor.y}`)
        Nation.nations[this.nationId].unitList.push(this);
        this.currentProvince = Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province);
        this.currentProvince.gameObject.getChildById("_UnitRoot").addChild(this.gameObject);
        // console.log("unitRoot的子物体数量为" + getGameObjectById("UnitRoot").children.length);
        console.log("unit NationId" + this.nationId)
        this.currentProvince.unitList.push(this);

        this.unitParamWhenRecruited = UnitParam.copyUnitParam(this.unitParam);  //记录单位的初始属性
        // this.updateTransform();
        Nation.nations[this.nationId].doraChangeNextTurn -= this.unitParam.maintCost;  //扣除维护费用
    }

    onUpdate(): void {
        // console.log("unit" + this.nationId + "is updated")
        this.indexInProcince = Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province).unitList.indexOf(this);
        // this.updateTransform();
        //更新战力
        Calculator.calculateUnitGroupPower(this);
        this.gameObject.onMouseLeftDown = () => {
            console.log('unit' + this.nationId + 'is clicked');
            SelectedObjectInfoMangaer.showSelectedObjectInfo(this);
        }

        //更新显示
        this.gameObject.getChildById("UnitPowerText").getBehaviour(TextRenderer).text = this.power.toString();
        if (SelectedObjectInfoMangaer.selectedBehaviour == this) {
            this.gameObject.getChildById("_UnitApText").getBehaviour(TextRenderer).text = `AP:${this.unitParam.ap}/${this.unitParam.apMax}(-${this.apCostToMove})`;
        }
        else {
            this.gameObject.getChildById("_UnitApText").getBehaviour(TextRenderer).text = `AP:${this.unitParam.ap}/${this.unitParam.apMax}`;
        }
    }

    onEnd(): void {
        console.log(`UnitBehaviour ${this.unitParam.name}(国家：${this.nationId}) 被destroy`)
        Nation.nations[this.nationId].unitList.splice(Nation.nations[this.nationId].unitList.indexOf(this), 1);  //从unitList中删除
        Nation.nations[this.nationId].doraChangeNextTurn += this.unitParam.maintCost;  //退还维护费用
        this.currentProvince.unitList.splice(this.currentProvince.unitList.indexOf(this), 1);  //从当前省份的unitList中删除
        console.log(`死亡单位属于领地${this.currentProvince.coord.x} ${this.currentProvince.coord.y}
        ，死亡后该领地单位数量为${this.currentProvince.unitList.length}`)
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(ProvinceGenerator).gridSpace;
        var x = this.unitCoor.x * gridSpace + (this.unitCoor.y % 2) * gridSpace / 2 + gridSpace / 2;
        var y = this.unitCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        // // 临时代码
        // if (Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province).unitList.length > 1) {
        //     //当地块上有两个单位时
        //     y += this.indexInProcince * 100;
        // }
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;

    }

    moveToProvince(province: Province): boolean {
        if (this.isInCombat) {
            console.log("unit is in combat");
            if (this.nationId === GameProcess.playerNationId) {
                generateTip(this, "单位正在战斗中");
            }
            return false;
        }

        if (!province) {
            console.log("province is undefined")
            return false;
        }

        const provinceCoor = province.coord;
        if (this.unitParam.ap < province.apCost) {
            console.log("AP is not enough");

            generateTip(this, "行动点不足");
            return false;
        }

        if (!province.isOwnable) {
            generateTip(this, "海面不可通行");
            return false;
        }

        if (!ProvinceGenerator.areAdjacent(this.unitCoor.x, this.unitCoor.y, provinceCoor.x, provinceCoor.y)) {
            console.log("province is not adjacent");
            generateTip(this, "不相邻");
            return false;
        }

        //若目标省份处于战争状态且自己不是战斗单位，则无法移动
        if (province.battle !== undefined && !this.unitParam.isBattleUnit) {
            console.log("province is in war");
            if (this.nationId === GameProcess.playerNationId) {
                generateTip(this, "目标省份处于战争状态");
            }
            return false;
        }

        var parent = province.gameObject.getChildById("_UnitRoot");

        if (this.unitParam.isBattleUnit) {
            //移除目标领地上的敌国非战斗单位
            for (let i = 0; i < province.unitList.length; i++) {
                if (!province.unitList[i].unitParam.isBattleUnit
                    && Nation.nations[this.nationId].enemyNationList.some((nation) => nation.nationId == province.unitList[i].nationId)) {
                    province.unitList[i].gameObject.destroy();
                }
            }

            //若领地上已经有战斗
            if (province.battle !== undefined) {
                //根据自己的nationId加入相应的一方
                if (this.nationId == province.battle.attackerUnitList[0].nationId) {
                    console.log(`unit${this.nationId} 加入进攻方`);
                    this.isInCombat = true;
                    province.battle.attackerUnitList.push(this);
                    province.battle.attackerPowerLeft += this.power;
                    parent = province.gameObject.getChildById("_AttackerUnitRoot")
                }
                else if (this.nationId == province.battle.defenderUnitList[0].nationId) {
                    console.log(`unit${this.nationId} 加入防守方`);
                    this.isInCombat = true;
                    province.battle.defenderUnitList.push(this);
                    province.battle.defenderPowerLeft += this.power;
                }
                else {
                    //都不是，说明是第三方单位，无法进入领地
                    console.log("unit is not belong to either side");
                    if (this.nationId === GameProcess.playerNationId) {
                        generateTip(this, "目标省份处于战争状态");
                    }
                    return false;
                }
            }
            //若领地上没有战斗
            else {
                //获取目标领地上的敌国战斗单位
                const enemyUnitInProvince = province.unitList.filter((unit) => Nation.nations[this.nationId].enemyNationList.some((nation) => nation.nationId == unit.nationId));
                //若目标省份上有敌国战斗单位
                if (enemyUnitInProvince.length > 0) {
                    console.log(`领地的单位列表长度为${province.unitList.length}`)
                    console.log(`${this.nationId} 与 ${province.unitList[0].nationId} 发生战斗`);
                    this.isInCombat = true;
                    province.unitList[0].isInCombat = true;
                    var newBattle = new Battle();
                    const attackerNationId = this.nationId;  //进入领地者为攻击方
                    newBattle.attackerNation = Nation.nations[this.nationId];
                    const defenderNationId = province.unitList[0].nationId;  //领地内单位为防守方
                    newBattle.defenderNation = Nation.nations[province.unitList[0].nationId];

                    //填入自己
                    newBattle.attackerUnitList.push(this);
                    newBattle.attackerPowerLeft += this.power;
                    parent = province.gameObject.getChildById("_AttackerUnitRoot")

                    for (const unit of province.unitList) {
                        //填入防守方单位
                        if (unit.nationId == defenderNationId) {
                            newBattle.defenderUnitList.push(unit);
                            newBattle.defenderPowerLeft += unit.power;
                        }
                        else {
                            //都不是，则将其传送回其国家最近的城市
                            var nearestCit;
                            for (const city of Nation.nations[unit.nationId].cityList) {
                                if (nearestCit === undefined) {
                                    nearestCit = city;
                                }
                                else {
                                    if (this.currentProvince.getDistanceToProvince(city) < this.currentProvince.getDistanceToProvince(nearestCit.coord)) {
                                        nearestCit = city;
                                    }
                                }
                            }
                            unit.unitCoor = nearestCit.coord;
                        }
                    }

                    province.battle = newBattle;
                    newBattle.province = province;
                    BattleHandler.battleQueue.push(newBattle);  //将战斗加入战斗队列
                    const prefab = this.engine.createPrefab(new UI_BattleInfoButtonPrefabBinding());
                    prefab.getBehaviour(UI_BattleInfoButton).battle = newBattle;
                    province.gameObject.getChildById("_BattleInfoButtonRoot").addChild(prefab);
                }
            }
        }

        //移动
        //离开当前省份
        this.currentProvince = Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province);
        this.currentProvince.unitList.splice(this.currentProvince.unitList.indexOf(this), 1);
        this.unitParam.ap -= province.apCost;

        //进入新的省份
        this.unitCoor = provinceCoor;
        province.unitList.push(this);
        this.currentProvince = province;
        this.gameObject.changeParent(parent);

        return true;
    }

    act() {
        const nation = Nation.nations[this.nationId];
        const colonyCost = Calculator.calculateColonyCost(nation.nationId, this.currentProvince.coord);
        switch (this.unitParam.name) {
            case "开拓者":
                //若领地已被占领，则不可开拓
                if (this.currentProvince.nationId !== 0) {
                    //生成提示
                    if (this.nationId === GameProcess.playerNationId)
                        generateTip(this, "该领地已被其他勢力占领");
                    return;
                }
                //若金币足够，则殖民
                if (nation.dora >= colonyCost) {
                    //生成提示
                    if (this.nationId === GameProcess.playerNationId)
                        generateTip(this, "开拓完成");
                    //处理逻辑
                    this.currentProvince.changeNationId(nation.nationId);  //改变省份归属
                    console.log(`国家${nation.nationId}的领地列表`);
                    console.log(nation.provinceOwnedList);
                    //如果玩家没有城市，则将该省份加入城市列表
                    if (nation.cityList.length === 0) {
                        this.currentProvince.becomeCity();
                        console.log(`国家${nation.nationId}的城市列表`);
                        console.log(nation.cityList);
                    }
                    nation.dora -= Calculator.calculateColonyCost(nation.nationId, this.currentProvince.coord);  //扣钱
                    this.gameObject.destroy();  //销毁单位
                    if (getGameObjectById("UI_selectedUnitInfo")) {
                        getGameObjectById("UI_selectedUnitInfo").destroy();
                    }
                }
                else {
                    console.log("金币不足");
                    //生成提示
                    if (this.nationId === GameProcess.playerNationId)
                        generateTip(this, "金币不足");
                }
                break;
            case "筑城者":
                //若领地已被占领，则不可筑城
                if (this.currentProvince.nationId !== nation.nationId) {
                    //生成提示
                    if (this.nationId === GameProcess.playerNationId)
                        generateTip(this, "该领地尚未拥有");
                    return;
                }
                //若国家领地数量已达上限，则不可筑城
                if (nation.cityList.length >= nation.cityMax) {
                    //生成提示
                    if (this.nationId === GameProcess.playerNationId)
                        generateTip(this, "城市数量已达上限");
                    return;
                }
                //若领地已被己方开拓
                if (this.currentProvince.nationId === nation.nationId) {
                    //若领地已被筑城，则不可筑城
                    if (this.currentProvince.isCity) {
                        //生成提示
                        if (this.nationId === GameProcess.playerNationId)
                            generateTip(this, "该领地已被筑城");
                        return;
                    }
                    //生成提示
                    if (this.nationId === GameProcess.playerNationId) {
                        generateTip(this, "筑城成功");
                    }

                    //处理逻辑
                    this.currentProvince.becomeCity();
                    nation.dora -= Calculator.calculateColonyCost(nation.nationId, this.currentProvince.coord);  //扣钱
                    this.gameObject.destroy();
                    getGameObjectById("UI_selectedUnitInfo").destroy();
                }
                break;
        }
    }
}