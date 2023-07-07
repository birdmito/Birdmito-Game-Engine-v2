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

export class UnitBehaviour extends Behaviour {
    nationId: number;
    unitCoor: { x: number, y: number } = { x: 1, y: 0 };
    unitParamWhenRecruited: UnitParam;

    private _unitParam: UnitParam = UnitParam.originUnitParamList[0];
    get unitParam(): UnitParam {
        return this._unitParam;
    }
    /**在更新该属性时一定要直接赋值，不要修改其内部属性，否则会导致预计的dora变动出错*/
    set unitParam(value: UnitParam) {
        const oldUnitParam = this._unitParam;
        this._unitParam = value;
        Nation.nations[this.nationId].doraChangeNextTurn += oldUnitParam.maintCost - value.maintCost;  //更新预计的dora变动
    }

    onStart(): void {
        Nation.nations[this.nationId].unitList.push(this);
        this.unitParamWhenRecruited = UnitParam.copyUnitParam(this.unitParam);  //记录单位的初始属性
        this.updateTransform();
        Nation.nations[this.nationId].doraChangeNextTurn -= this.unitParam.maintCost;  //扣除维护费用
    }

    onUpdate(): void {
        this.updateTransform();
        this.gameObject.onClick = () => {
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
        const x = this.unitCoor.x * gridSpace + (this.unitCoor.y % 2) * gridSpace / 2 + gridSpace / 2;
        const y = this.unitCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;
    }

    moveToProvince(province: Province): void {
        const provinceCoor = province.coord;
        if (this.unitParam.ap <= 0) {
            console.log("AP is not enough");
            return;
        }
        if (!province.isOwnable) {
            generateTip(this, "海面不可通行");
            return;
        }

        if (ProvinceGenerator.areAdjacent(this.unitCoor.x, this.unitCoor.y, provinceCoor.x, provinceCoor.y)) {
            if (province.apCost <= this.unitParam.ap) {
                this.unitCoor = provinceCoor;
                this.unitParam.ap -= province.apCost;
            }
            else {
                console.log("AP is not enough");
                return;
            }
        }
        else {
            console.log("province is not adjacent");
            return;
        }
    }

    // 判断两个坐标是否相邻
    
}