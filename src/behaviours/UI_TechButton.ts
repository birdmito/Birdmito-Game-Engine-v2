import { UI_governmentWindowPrefabBinding } from "../bindings/UI_GovernmentWindowPrefabBinding";
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
            //遍历玩家可研究的科技，并从中随机抽取三个
            const nation = Nation.nationList[1];
            const techList = Technology.getAvailableTech(nation.nationId);
            const techListRandom = [];
            //不重复的抽取三个科技
            while (techListRandom.length < 3) {
                const random = Math.floor(Math.random() * techList.length);
                if (!techListRandom.includes(techList[random])) {
                    techListRandom.push(techList[random]);
                }
            }

            for (const techRandom of techListRandom) {
                const techItemBinding = new UI_itemPrefabBinding();
                techItemBinding.item = techRandom.name;
                techItemBinding.itemInfo = techRandom.getInfo();
                techItemBinding.itemClickEventText = "研究";
                const techItem = this.engine.createPrefab(techItemBinding);
                itemRoot.addChild(techItem);
            }
            techWindowRoot.addChild(newTechWindow);
        }
    }
}
