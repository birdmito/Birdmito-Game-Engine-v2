import { UI_battleInfoWindowPrefabBinding } from "../bindings/UI_battleInfoWindowPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Battle } from "./BattleHandler";
import { UI_UpdateBattleInfo } from "./UI_UpdateBattleInfo";

export class UI_BattleInfoButton extends Behaviour {
    battle: Battle;

    onStart(): void {
        // console.log("战斗详情按钮")
        //停止冒泡，防止点击战斗信息时同时弹出省份
        this.gameObject.stopPropagation = true
    }

    onUpdate(): void {
        // console.log("战斗详情按钮")
        this.gameObject.onMouseLeftDown = () => {
            console.log("生成战斗详情界面")
            if (getGameObjectById("UI_battleInfoWindow")) {
                getGameObjectById("UI_battleInfoWindow").destroy()
            }  //如果已经存在战斗详情界面，则销毁

            const prefab = this.engine.createPrefab(new UI_battleInfoWindowPrefabBinding())
            prefab.getBehaviour(UI_UpdateBattleInfo).battle = this.battle
            getGameObjectById("uiRoot").addChild(prefab)
        }
    }
}
