import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { UnitBehaviour } from "./UnitBehaviour";

export class Ai_Enemies extends Behaviour {

    aiCoor: { x: number, y: number } = { x: 0, y: 0 };
    static i: number = 0;

    onStart(): void {
        this.updateTransform();
    }

    onUpdate(): void {
        this.updateTransform();
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(ProvinceGenerator).gridSpace;
        const x = this.aiCoor.x * gridSpace + (this.aiCoor.y % 2) * gridSpace / 2 + gridSpace / 2;
        const y = this.aiCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;
    }

    moveToOtherProvinces(): void {
        const playerSoilderCoor = getGameObjectById("Unit").getBehaviour(UnitBehaviour).unitCoor;
        const ownedProvinces = Nation.nations[1].provinceOwnedList;
        // this.aiCoor = ownedProvinces[0].getBehaviour(Province).coord;
        // console.log(ownedProvinces[Ai_Enemies.i].getBehaviour(Province).buildingList[0])
        // ownedProvinces[0].getBehaviour(Province).buildingList.splice(0,1);
        if (ownedProvinces.length != 0) {
            if (ownedProvinces[Ai_Enemies.i] != null) {
                this.aiCoor = ownedProvinces[Ai_Enemies.i].coord;
                console.log('AI进入玩家省份');
                if (ownedProvinces.length > 1) {
                    this.attack();
                    Ai_Enemies.i++;
                    console.log(Ai_Enemies.i);
                }
                else {
                    // Ai_Enemies.i++;
                    console.log(Ai_Enemies.i);
                }
            }
            else {
                console.log('玩家没有AI可攻击省份');
            }
        }
        else {
            this.aiCoor = playerSoilderCoor;
            console.log('玩家还未拥有省份');
        }
    }

    attack(): void {
        const playerSoilderCoor = getGameObjectById("Unit").getBehaviour(UnitBehaviour).unitCoor;
        const ownedProvinces = Nation.nations[1].provinceOwnedList;

        if (ownedProvinces[Ai_Enemies.i].nationId == 1) {
            ownedProvinces[Ai_Enemies.i].changeNationId(2);
            console.log('AI已占领该省份');
            // console.log(ownedProvinces[Ai_Enemies.i].getBehaviour(Province).buildingList[0])
            // ownedProvinces[Ai_Enemies.i].getBehaviour(Province).buildingList.splice(Ai_Enemies.i,1);
        }
        else {
            console.log('玩家已失去所有可被攻击省份');
        }

    }
}
