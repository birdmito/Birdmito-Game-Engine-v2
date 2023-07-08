import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_UnitBehaviourButton } from "./UI_UnitBehaviourButton";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Province } from "./Province";
import { N } from "vitest/dist/types-2b1c412e";
import { UnitParam as UnitParam } from "./UnitParam";
import { Nation } from "./Nation";
import { generateTip } from "./Tip";
import { Moveable } from "./Moveable";
import { Calculator } from "./Calculator";
import { Battle, BattleManager } from "./BattleManager";

export class UnitBehaviour extends Behaviour implements Moveable {
    nationId: number;
    unitCoor: { x: number, y: number } = { x: 1, y: 0 };
    unitParamWhenRecruited: UnitParam;

    unitQuantity: number = 1;
    power;
    isInCombat: boolean = false;

    indexInProcince: number = 0;

    private _unitParam: UnitParam = UnitParam.originUnitParamList[0];
    get unitParam(): UnitParam {
        return this._unitParam;
    }
    /**在更新该属性时一定要直接赋值，不要修改其内部属性，否则会导致预计的dora变动出错*/
    set unitParam(value: UnitParam) {
        const oldUnitParam = this._unitParam;
        this._unitParam = value;
        Nation.nations[this.nationId].doraChangeNextTurn += (oldUnitParam.maintCost - value.maintCost) * this.unitQuantity;  //更新预计的dora变动
    }

    onStart(): void {
        Nation.nations[this.nationId].unitList.push(this);
        const currentProvince = Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province);
        currentProvince.gameObject.getChildById("_UnitRoot").addChild(this.gameObject);
        currentProvince.unitList.push(this);

        this.unitParamWhenRecruited = UnitParam.copyUnitParam(this.unitParam);  //记录单位的初始属性
        this.updateTransform();
        Nation.nations[this.nationId].doraChangeNextTurn -= this.unitParam.maintCost;  //扣除维护费用
    }

    onUpdate(): void {
        this.indexInProcince = Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province).unitList.indexOf(this);
        this.updateTransform();
        //更新战力
        Calculator.calculateUnitGroupPower(this);
        this.gameObject.onMouseLeftDown = () => {
            console.log('unit is cliceked')
            getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).showSelectedObjectInfo(this);
        }
    }

    onEnd(): void {
        Nation.nations[this.nationId].unitList.splice(Nation.nations[this.nationId].unitList.indexOf(this), 1);  //从unitList中删除
        Nation.nations[this.nationId].doraChangeNextTurn += this.unitParam.maintCost;  //退还维护费用
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(ProvinceGenerator).gridSpace;
        var x = this.unitCoor.x * gridSpace + (this.unitCoor.y % 2) * gridSpace / 2 + gridSpace / 2;
        var y = this.unitCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        // 临时代码
        if (Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province).unitList.length > 1) {
            //当地块上有两个单位时
            y += this.indexInProcince * 100;
        }
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;

    }

    moveToProvince(province: Province): void {
        if (this.isInCombat) {
            console.log("unit is in combat");
            if (this.nationId === 1) {
                generateTip(this, "单位正在战斗中");
            }
            return;
        }

        const provinceCoor = province.coord;
        if (this.unitParam.ap < province.apCost) {
            console.log("AP is not enough");
            generateTip(this, "行动点不足");
            return;
        }

        if (!province.isOwnable) {
            generateTip(this, "海面不可通行");
            return;
        }

        if (!ProvinceGenerator.areAdjacent(this.unitCoor.x, this.unitCoor.y, provinceCoor.x, provinceCoor.y)) {
            console.log("province is not adjacent");
            generateTip(this, "不相邻");
            return;
        }

        //移动
        //离开当前省份
        const currentProvince = Province.provincesObj[this.unitCoor.x][this.unitCoor.y].getBehaviour(Province);
        currentProvince.unitList.splice(currentProvince.unitList.indexOf(this), 1);
        // this.gameObject.parent.removeChild(this.gameObject);
        this.unitParam.ap -= province.apCost;
        this.unitCoor = provinceCoor;
        //进入新的省份
        province.unitList.push(this);
        // province.gameObject.getChildById("_UnitRoot").addChild(this.gameObject);

        //若移动后遇到异国单位，则给BattleManager添加一场战斗
        if (province.unitList.length > 1 && province.unitList[0].nationId != this.nationId) {
            //若领地上已经有战斗
            if (province.battle !== undefined) {
                //根据自己的nationId加入相应的一方
                if (this.nationId == province.battle.attackerUnitList[0].nationId) {
                    this.isInCombat = true;
                    province.battle.attackerUnitList.push(this);
                }
                else if (this.nationId == province.battle.defenderUnitList[0].nationId) {
                    this.isInCombat = true;
                    province.battle.defenderUnitList.push(this);
                }
                else {
                    //都不是，说明是第三方单位，不参与战斗
                    return;
                }
            }


            this.isInCombat = true;
            province.unitList[0].isInCombat = true;
            var newBattle = new Battle();
            const attackerNationId = this.nationId;  //进入领地者为攻击方
            const defenderNationId = province.unitList[0].nationId;  //领地内单位为防守方
            for (const unit of province.unitList) {
                //先填入防守方单位
                if (unit.nationId == defenderNationId) {
                    newBattle.defenderUnitList.push(unit);
                }
                //再填入攻击方单位
                else if (unit.nationId == attackerNationId) {
                    newBattle.attackerUnitList.push(unit);
                }
            }
            province.battle = newBattle;
            newBattle.province = province;
            BattleManager.battleQueue.push(newBattle);  //将战斗加入战斗队列
        }
    }
}