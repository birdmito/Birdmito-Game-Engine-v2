import { UI_tipPrefabBinding } from "../bindings/UI_tipPrefabBinding";
import { GameObject, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Calculator } from "./Calculator";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { UnitBehaviour } from "./UnitBehaviour";
import { TextRenderer } from "../engine/TextRenderer";

export class UI_ColonyButton extends Behaviour {
    provinceToColony: GameObject;
    unitToDestroy: GameObject;
    nation;
    colonyCost;

    onStart(): void {
    }

    onUpdate(): void {
        this.nation = Nation.nations[this.unitToDestroy.getBehaviour(UnitBehaviour).unitParam.nationId];
        const provinceBehaviour = this.provinceToColony.getBehaviour(Province);
        this.colonyCost = Calculator.calculateColonyCost(this.nation.nationId, provinceBehaviour.coord);
        //更新按钮文本
        getGameObjectById("ColonyText").getBehaviour(TextRenderer).text = "开拓 （" + this.colonyCost + "金币）";
        this.gameObject.onClick = () => {
            //国家
            provinceBehaviour.changeNationId(this.nation.nationId);
            if (this.nation.dora >= this.colonyCost) {
                //生成提示
                const tipPrefab = this.engine.createPrefab(new UI_tipPrefabBinding);
                tipPrefab.getBehaviour(UI_tipPrefabBinding).tipText = "殖民成功";
                getGameObjectById("uiRoot").addChild(tipPrefab);
                //处理逻辑
                this.nation.dora -= Calculator.calculateColonyCost(this.nation.nationId, provinceBehaviour.coord);
                this.unitToDestroy.destroy();
                getGameObjectById("UI_selectedUnitInfo").destroy();
            }
            else {
                console.log("金币不足");
                //生成提示
                const tipPrefab = this.engine.createPrefab(new UI_tipPrefabBinding);
                tipPrefab.getBehaviour(UI_tipPrefabBinding).tipText = "金币不足";
                getGameObjectById("uiRoot").addChild(tipPrefab);
            }
        }
    }
}
