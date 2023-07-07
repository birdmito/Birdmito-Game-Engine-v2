import { UI_tipPrefabBinding } from "../bindings/UI_tipPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Calculator } from "./Calculator";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { UnitBehaviour } from "./UnitBehaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { generateTip } from "./Tip";

export class UI_UnitBehaviourButton extends Behaviour {
    targetProvinceObj: GameObject;
    unitToDestroy: GameObject;
    nation: Nation;
    colonyCost;

    onStart(): void {
    }

    onUpdate(): void {
        this.nation = Nation.nations[this.unitToDestroy.getBehaviour(UnitBehaviour).unitParam.nationId];
        const provinceBehaviour = this.targetProvinceObj.getBehaviour(Province);
        this.colonyCost = Calculator.calculateColonyCost(this.nation.nationId, provinceBehaviour.coord);

        //更新按钮文本
        switch (this.unitToDestroy.getBehaviour(UnitBehaviour).unitParam.name) {
            case "开拓者":
                getGameObjectById("UnitBehaviourText").getBehaviour(TextRenderer).text = "开拓 （" + this.colonyCost + "金币）";
                break;
            case "筑城者":
                getGameObjectById("UnitBehaviourText").getBehaviour(TextRenderer).text = "筑城 （" + this.colonyCost + "金币）";
                break;
        }

        this.gameObject.onClick = () => {
            switch (this.unitToDestroy.getBehaviour(UnitBehaviour).unitParam.name) {
                case "开拓者":
                    //若领地已被占领，则不可开拓
                    if (provinceBehaviour.nationId !== 0) {
                        //生成提示
                        generateTip(this, "该领地已被其他勢力占领");
                        return;
                    }
                    //若金币足够，则殖民
                    if (this.nation.dora >= this.colonyCost) {
                        //生成提示
                        generateTip(this, "殖民成功");
                        //处理逻辑
                        provinceBehaviour.changeNationId(this.nation.nationId);  //改变省份归属
                        console.log('玩家领地列表');
                        console.log(this.nation.provinceOwnedList);
                        //如果玩家没有城市，则将该省份加入城市列表
                        if (this.nation.cityList.length === 0) {
                            provinceBehaviour.becomeCity();
                            console.log('玩家城市列表');
                            console.log(this.nation.cityList);
                        }
                        this.nation.dora -= Calculator.calculateColonyCost(this.nation.nationId, provinceBehaviour.coord);  //扣钱
                        this.unitToDestroy.destroy();
                        getGameObjectById("UI_selectedUnitInfo").destroy();
                    }
                    else {
                        console.log("金币不足");
                        //生成提示
                        generateTip(this, "金币不足");
                    }
                    break;
                case "筑城者":
                    //若领地已被占领，则不可筑城
                    if (provinceBehaviour.nationId !== this.nation.nationId) {
                        //生成提示
                        generateTip(this, "该领地尚未拥有");
                        return;
                    }
                    //若国家领地数量已达上限，则不可筑城
                    if (this.nation.cityList.length >= this.nation.cityMax) {
                        //生成提示
                        generateTip(this, "城市数量已达上限");
                        return;
                    }
                    //若领地已被己方开拓
                    if (provinceBehaviour.nationId === this.nation.nationId) {
                        //若领地已被筑城，则不可筑城
                        if (provinceBehaviour.isCity) {
                            //生成提示
                            generateTip(this, "该领地已被筑城");
                            return;
                        }
                        //生成提示
                        generateTip(this, "筑城成功");
                        //处理逻辑
                        provinceBehaviour.becomeCity();
                        this.nation.dora -= Calculator.calculateColonyCost(this.nation.nationId, provinceBehaviour.coord);  //扣钱
                        this.unitToDestroy.destroy();
                        getGameObjectById("UI_selectedUnitInfo").destroy();
                    }
                    break;

            }
        }
    }
}

