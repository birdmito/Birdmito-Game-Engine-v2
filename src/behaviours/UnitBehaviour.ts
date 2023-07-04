import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_ColonyButton } from "./UI_ColonyButton";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Province } from "./Province";
import { N } from "vitest/dist/types-2b1c412e";
import { UnitParam as UnitParam } from "./UnitParam";

export class UnitBehaviour extends Behaviour {
    static soilderList: UnitBehaviour[] = [];
    soidlerCoor: { x: number, y: number } = { x: 1, y: 0 };
    unitParam: UnitParam = UnitParam.allUnitParamList[0];
    onStart(): void {
        UnitBehaviour.soilderList.push(this);
        this.updateTransform();
    }

    onUpdate(): void {
        this.updateTransform();
        this.gameObject.onClick = () => {
            console.log('unit is cliceked')
            getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).showSelectedObjectInfo(this);
        }
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(ProvinceGenerator).gridSpace;
        const x = this.soidlerCoor.x * gridSpace + (this.soidlerCoor.y % 2) * gridSpace / 2 + gridSpace / 2;
        const y = this.soidlerCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;
    }

    moveToProvince(province: Province): void {
        const provinceCoor = province.coord;
        if (this.unitParam.ap <= 0) {
            console.log("AP is not enough");
            return;
        }

        if (this.areAdjacent(this.soidlerCoor.x, this.soidlerCoor.y, provinceCoor.x, provinceCoor.y)) {
            if (province.apCost <= this.unitParam.ap) {
                this.soidlerCoor = provinceCoor;
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
    areAdjacent(x1: Number, y1: Number, x2: Number, y2: Number): boolean {
        // 当前单元格朝上的相邻位置的偏移量
        var offsets;
        if (Number(y1) % 2 === 0 || x1 === 0) {
            console.log("y1是偶数");
            //y为偶数时[2,2]：
            //0 - - -
            //1 + + -
            //2 + - +
            //3 + + -
            offsets = [
                [-1, 0], // 左
                [1, 0], // 右
                [-1, -1], // 左上
                [0, -1], // 右上
                [-1, 1], // 左下
                [0, 1] // 右下
            ];
        } else {
            console.log("y1是奇数");
            //+表示相邻格
            //y为奇数时[2,1]：
            //0 - + +
            //1 + - +
            //2 - + +
            offsets = [
                [-1, 0], // 左
                [1, 0], // 右
                [0, -1], // 左上
                [1, -1], // 右上
                [0, 1], // 左下
                [1, 1] // 右下
            ];
        }

        // 判断两个坐标是否相邻
        for (var i = 0; i < offsets.length; i++) {
            var offset = offsets[i];
            if (x1 + offset[0] === x2 && y1 + offset[1] === y2) {
                return true;
            }
        }

        return false;
    }
}