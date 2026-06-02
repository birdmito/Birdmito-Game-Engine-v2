import { UI_itemPrefabBinding } from "../bindings/UI_itemPrefabBinding";
import { UI_techWindowPrefabBinding } from "../bindings/UI_techWindowPrefabBinding copy";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { GameProcessMgr } from "./GameProcessMgr";
import { Nation } from "./Nation";
import { Technology } from "./Technology";
import { UI_UpdateItemInfo } from "./UI_UpdateItemInfo";

export class UI_TechButton extends Behaviour {
    lastFrameTurn: number = 1;
    onUpdate(): void {
        this.gameObject.onMouseLeftDown = () => {
            this.updateTechWindow();
        }

        if (this.lastFrameTurn !== GameProcessMgr.turnrNow) {
            this.updateTechWindow();
        }
        this.lastFrameTurn = GameProcessMgr.turnrNow



        if (Nation.nations[GameProcessMgr.playerNationId].currentTechName !== '') {
            getGameObjectById("CurrentTechText").getBehaviour(TextRenderer).text =
                "当前科技：|" + Technology.getNationTechByName(1, Nation.nations[GameProcessMgr.playerNationId].currentTechName).getInfo();
            //更换图片
            if (Technology.getOriginTechByName(Nation.nations[GameProcessMgr.playerNationId].currentTechName).techName === '探秘奥坎之径'
                || Technology.getOriginTechByName(Nation.nations[GameProcessMgr.playerNationId].currentTechName).preTechName.some((value) => value === '探秘奥坎之径')) {
                getGameObjectById("_CurrentTechImage").getBehaviour(BitmapRenderer).source = './assets/images/ScreenArt_Technology_1.png';
            }
            else if (Technology.getOriginTechByName(Nation.nations[GameProcessMgr.playerNationId].currentTechName).techName === '战火狂潮之道'
                || Technology.getOriginTechByName(Nation.nations[GameProcessMgr.playerNationId].currentTechName).preTechName.some((value) => value === '战火狂潮之道')) {
                getGameObjectById("_CurrentTechImage").getBehaviour(BitmapRenderer).source = './assets/images/ScreenArt_Technology_2.png';
            }
            else if (Technology.getOriginTechByName(Nation.nations[GameProcessMgr.playerNationId].currentTechName).techName === '奇迹工坊之路'
                || Technology.getOriginTechByName(Nation.nations[GameProcessMgr.playerNationId].currentTechName).preTechName.some((value) => value === '奇迹工坊之路')) {
                getGameObjectById("_CurrentTechImage").getBehaviour(BitmapRenderer).source = './assets/images/ScreenArt_Technology_3.png';
            }
        }
        else {
            getGameObjectById("CurrentTechText").getBehaviour(TextRenderer).text = "当前科技：无";
            getGameObjectById("_CurrentTechImage").getBehaviour(BitmapRenderer).source = './assets/images/ScreenArt_Technology_0.png';
        }
    }

    updateTechWindow() {
        //更新科技窗口
        const techWindowRoot = getGameObjectById("TechWindowRoot");
        if (techWindowRoot.children.length > 0) {
            techWindowRoot.children[0].destroy();
        }
        const newTechWindow = this.engine.createPrefab(new UI_techWindowPrefabBinding)
        const itemRoot = newTechWindow.getChildById("TechWindowItemListRoot");

        for (const techRandom of Nation.nations[GameProcessMgr.playerNationId].randomTechList) {
            const techItemBinding = new UI_itemPrefabBinding();
            console.log("添加科技" + techRandom.techName + "到科技窗口")
            techItemBinding.item = techRandom.techName;
            techItemBinding.itemClickEventText = "研究";
            const techItem = this.engine.createPrefab(techItemBinding);
            techItem.getChildById("_ItemInfo").getBehaviour(UI_UpdateItemInfo).province = Nation.nations[GameProcessMgr.playerNationId].capitalProvince;
            itemRoot.addChild(techItem);
        }
        techWindowRoot.addChild(newTechWindow);
    }
}
