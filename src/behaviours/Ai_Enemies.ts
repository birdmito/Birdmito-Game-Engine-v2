import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { Province } from "./Province";
import { ProvinceGenerator } from "./ProvinceGenerator";
import { UnitBehaviour } from "./UnitBehaviour";

export class Ai_Enemies extends Behaviour {

    aiCoor: { x: number, y: number } = { x: 0, y: 0 };

    onStart(): void {
        this.updateTransform();
    }

    onUpdate(): void { 
        this.updateTransform();
        this.gameObject.onMouseLeftDown = () => {
            console.log('enemies is cliceked');
        }
    }

    updateTransform(): void {
        const gridSpace = getGameObjectById("Map").getBehaviour(ProvinceGenerator).gridSpace;
        const x = this.aiCoor.x * gridSpace + (this.aiCoor.y % 2) * gridSpace / 2 + gridSpace / 2;
        const y = this.aiCoor.y * gridSpace * (Math.sqrt(3) / 2) + gridSpace * (Math.sqrt(3) / 2) / 2;
        this.gameObject.getBehaviour(Transform).x = x;
        this.gameObject.getBehaviour(Transform).y = y;        
    }

    moveToOtherProvinces(): void {
        const playersProvinces = getGameObjectById("Province").getBehaviour(Province);
        const playerSoilderCoor = getGameObjectById("Unit").getBehaviour(UnitBehaviour).soidlerCoor
        const playersProvincesID = playersProvinces.nationId;   
        const playersProvincesCoor = playersProvinces.coord;
        this.aiCoor = playerSoilderCoor
        // this.aiCoor = playersProvincesCoor;
        if(playersProvincesID === 1) {
            console.log('AI进入玩家省份');
            console.log(playersProvincesID);
        }
        else {
            console.log('AI进入其他省份');
            console.log(playersProvincesID);
        }
        
        // this.attack();
    }

    attack(): void {
        const playersProvinces = getGameObjectById("Province").getBehaviour(Province);
        const playersProvincesID = playersProvinces.nationId;
        if(playersProvincesID == 1 ) {
            console.log('enemies is attacking');
            playersProvinces.changeNationId(0);  
        }
    }
}
