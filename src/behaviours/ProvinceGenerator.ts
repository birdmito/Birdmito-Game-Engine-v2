import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ProvincePrefabBinding } from "../bindings/ProvincePrefabBinding";
import { number } from "../engine/validators/number";
import { GameObject } from "../engine";
import { Province } from "./Province";

export class ProvinceGenerator extends Behaviour {
    // @number()
    gridSizeX: number = 10;
    // @number()
    gridSizeY: number = 10;
    // @number()
    gridSpace: number = 172;

    // static provinces: GameObject[][] = [];

    onStart(): void {
        // 创建六边形网格坐标数组
        const hexGrid = this.createHexGrid(this.gridSizeX, this.gridSizeY, this.gridSpace);
        // 创建省份
        for (let i = 0; i < this.gridSizeY; i++) {
            for (let j = 0; j < this.gridSizeX; j++) {
                const province = this.gameObject.engine.createPrefab(new ProvincePrefabBinding());
                province.getBehaviour(Transform).x = hexGrid[i][j].x;
                province.getBehaviour(Transform).y = hexGrid[i][j].y;
                province.getBehaviour(Province).coord = { x: j, y: i };
                this.gameObject.addChild(province);
                if (!Province.provinces[j])
                Province.provinces[j] = [];
                Province.provinces[j][i] = province;
            }
        }
    }

    // 创建六边形网格坐标数组
    createHexGrid(gridSizeX, gridSizeY, spacing) {
        const hexGrid = [];
        for (let row = 0; row < gridSizeX; row++) {
            const hexRow = [];
            for (let col = 0; col < gridSizeY; col++) {
                const x = col * spacing + (row % 2) * spacing / 2;
                const y = row * spacing * (Math.sqrt(3) / 2);

                hexRow.push({ x: x, y: y });
            }
            hexGrid.push(hexRow);
        }
        return hexGrid;
    }

    // static updateProvince() {
    //     //每回合开始时，所有领地给予所属国家产出
    //     for (let i = 0; i < Province.provinces.length; i++) {
    //         for (let j = 0; j < Province.provinces[i].length; j++) {
    //             const province = Province.provinces[i][j].getBehaviour(Province);
    //             province.giveOwnerProduction();
    //             province.updateBuildingInfo();
    //         }
    //     }
    // }
}
