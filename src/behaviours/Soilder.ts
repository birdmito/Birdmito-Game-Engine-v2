import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_ColonyButton } from "./UI_ColonyButton";
import { MapManager } from "./MapManager";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Province } from "./Province";

export class Soilder extends Behaviour {
    nationId: number = 1;
    provinceCoor: { x: number, y: number } = { x: 1, y: 0 };
    ap: number = 100000;
    apMax: number = 10;

    onStart(): void {
        this.updateTransform();
        console.log("soilder provinceCoor", this.provinceCoor);
    }

    onUpdate(): void {
        this.updateTransform();
        this.gameObject.onClick = () => {
            console.log('soilder is cliceked')
            getGameObjectById("SelectedObjectInfoMangaer").getBehaviour(SelectedObjectInfoMangaer).showSelectedObjectInfo(this);
        }
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(MapManager).gridSpace;
        const x = this.provinceCoor.x * gridSpace + (this.provinceCoor.y % 2) * gridSpace / 2 + gridSpace / 2;
        const y = this.provinceCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;
    }

    moveToProvince(province: Province): void {
        const provinceCoor = province.coord;
        if (this.ap <= 0) {
            console.log("AP is not enough");
            return;
        }

        if (this.areAdjacent(this.provinceCoor, provinceCoor)) {
            if (province.apCost <= this.ap) {
                this.provinceCoor = provinceCoor;
                this.ap -= province.apCost;
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
    areAdjacent(coord1, coord2) {
        // 获取coord1和coord2的行列值
        var row1 = coord1[1],
            col1 = coord1[0];
        var row2 = coord2[1],
            col2 = coord2[0];

        // 当前单元格朝上的相邻位置的偏移量
        var offsets;
        if (row1 % 2 === 0) {
            offsets = [
                [-1, 0], // 左上
                [0, -1], // 左
                [0, 1], // 右
                [-1, 1], // 右上
                [1, -1], // 左下
                [1, 0] // 右下
            ];
        } else {
            offsets = [
                [-1, -1], // 左上
                [0, -1], // 左
                [0, 1], // 右
                [-1, 0], // 右上
                [1, -1], // 左下
                [1, 0] // 右下
            ];
        }

        // 判断两个坐标是否相邻
        for (var i = 0; i < offsets.length; i++) {
            var offset = offsets[i];
            if (row1 + offset[0] === row2 && col1 + offset[1] === col2) {
                return true;
            }
        }

        return false;
    }
}