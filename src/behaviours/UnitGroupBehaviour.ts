import { Behaviour } from "../engine/Behaviour";
import { Calculator } from "./Calculator";
import { UnitParam } from "./UnitParam";

export class UnitGroupBehaviour extends Behaviour {
    nationId: number;
    unitCoor: { x: number, y: number } = { x: 1, y: 0 };
    unitList: UnitParam[] = [];
    groupPower: number = 0;

    onUpdate(): void {
        //更新战力
    }
}