import { Behaviour } from "../engine/Behaviour";
import { Nation } from "./Nation";
import { Province } from "./Province";

export class BotNationActMode {
    nation: Nation;
    botOnUpdate() {
        for (const unit of this.nation.unitList) {
            //开拓者行为
            if (unit.unitParam.name = '开拓者') {
                if (unit.currentProvince.nationId === 0) {
                    //若所在领地未被占领，则开拓
                    unit.act();
                }
                else{
                    //若所在领地已被占领，则向周围领地移动
                    const provinceList = unit.currentProvince.getAdjacentProvinces();
                }
            }
        }
    }
}
