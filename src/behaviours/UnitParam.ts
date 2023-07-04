import { UI_selectedUnitInfoPrefabBinding } from "../bindings/UI_SelectedUnitInfoPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { UI_ColonyButton } from "./UI_ColonyButton";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { Province } from "./Province";
import { N } from "vitest/dist/types-2b1c412e";
import { infoShowable } from "./infoShowable";
import { OverrideableNode } from "ts-morph";

export class UnitParam implements infoShowable {
    static allUnitParamList: UnitParam[] = [
        new UnitParam("开拓者", 10, 10, 100000, 10, 1),
    ];

    private constructor(name: string, cost: number, recruitProcessMax: number, apMax: number, maintCost: number, nationId: number = 1) {
        this.name = name;
        this.cost = cost;
        this.recruitProcessMax = recruitProcessMax;
        this.apMax = apMax;
        this.maintCost = maintCost;
        this.nationId = nationId;
    }

    static copyUnitParam(unitParam: UnitParam, nationId: number = 1): UnitParam {
        return new UnitParam(unitParam.name, unitParam.recruitProcessMax, unitParam.apMax, unitParam.maintCost, nationId);
    }

    static getUnitParamByName(name: string): UnitParam {
        return UnitParam.allUnitParamList.find((unitParam) => unitParam.name === name);
    }
    name: string = "soilder";
    cost: number = 10;
    recruitProcess: number = 10;
    recruitProcessMax: number = 10;
    nationId: number = 1;
    ap: number = 100000;
    apMax: number = 10;
    maintCost: number = 1;

    getInfo(): string {
        return `${this.name} 所属国家: ${this.nationId} 行动点: ${this.ap} 最大行动点: ${this.apMax} 维护费: ${this.maintCost}`;
    }
}