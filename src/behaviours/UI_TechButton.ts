import { UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { UI_techWindowPrefabBinding } from "../bindings/UI_techWindowPrefabBinding copy";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Nation } from "./Nation";
import { Technology } from "./Technology";

export class UI_TechButton extends Behaviour {
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            const techWindowRoot = getGameObjectById("TechWindowRoot");
            if (techWindowRoot.children.length > 0) {
                techWindowRoot.children[0].destroy();
            }
            const newTechWindow = this.engine.createPrefab(new UI_techWindowPrefabBinding)
            const itemRoot = newTechWindow.getChildById("TechWindowItemListRoot");

            for (const techRandom of Nation.nations[1].randomTechList) {
                const techItemBinding = new UI_itemPrefabBinding();
                console.log("添加科技" + techRandom.techName + "到科技窗口")
                techItemBinding.item = techRandom.techName;
                techItemBinding.itemInfo = techRandom.getInfo();
                techItemBinding.itemClickEventText = "研究";
                const techItem = this.engine.createPrefab(techItemBinding);
                itemRoot.addChild(techItem);
            }
            techWindowRoot.addChild(newTechWindow);
        }

        if (Nation.nations[1].currentTechName !== '') {
            getGameObjectById("CurrentTechText").getBehaviour(TextRenderer).text =
                "当前科技：" + Technology.getTechByName(1, Nation.nations[1].currentTechName).getInfo();
        }
    }
}
