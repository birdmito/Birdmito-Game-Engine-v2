import { GameObject } from "../engine";
import { Province } from "./Province";

export class ColonialProvinces{
    playersProvincesList: GameObject[] = [];
    
    addPlayerProvince(province: GameObject){
        this.playersProvincesList.push(province);
    }

    removePlayerProvince(province: GameObject){
        this.playersProvincesList.splice(this.playersProvincesList.indexOf(province), 1);
    }
}