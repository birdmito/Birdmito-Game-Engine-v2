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

        const playerSoilderCoor = getGameObjectById("Unit").getBehaviour(UnitBehaviour).soidlerCoor
        this.aiCoor = playerSoilderCoor

        // const playersProvincesCoor = getGameObjectById("Province").getBehaviour(Province).coord;
        // this.aiCoor = playersProvincesCoor;

        const playersProvinces = getGameObjectById("Province").getBehaviour(Province);
        let playersProvincesID = playersProvinces.nationId;

        if(playersProvincesID === 1) {
            console.log('AI进入玩家省份');
            console.log(playersProvincesID);
        }
        else {
            console.log('AI进入其他省份');
            console.log(playersProvincesID);
        }

        // const playersProvinces = getGameObjectById("Province").getBehaviour(Province);
        // let playersProvincesID = playersProvinces.nationId;
        // if(playersProvincesID === 1 ) {
        //     console.log('enemies is attacking');
        //     playersProvinces.changeNationId(0);  
        // }
        // else{
        //     console.log('敌人没有攻击');
        // }

        // this.attack();

    }

    attack(): void {
        const playersProvinces = getGameObjectById("Province").getBehaviour(Province);
        let playersProvincesID = playersProvinces.nationId;
        if(playersProvincesID == 1 ) {
            console.log('enemies is attacking');
            playersProvinces.changeNationId(0);  
        }
    }

}
