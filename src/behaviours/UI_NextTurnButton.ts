import { g } from "vitest/dist/types-2b1c412e";
import { colonyPrefabButtonBinding } from "../bindings/ColonyButtonPrefabBinding";
import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { getBehaviourClassByName, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ColonyBehaviour } from "./ColonyBehaviour";
import { GameProcess } from "./GameProcess";
import { MapManagerBehaviour } from "./MapManagerBehaviour";
import { ProvinceBehaviour } from "./ProvinceBehaviour";
import { RoundDisplayBehaviour } from "./RoundDisplayBehaviour";
import { BitmapRenderer } from "../engine/BitmapRenderer";

export class UI_NextTurnButton extends Behaviour {

    isTurnOver : boolean = false

    onUpdate(): void {
        this.gameObject.onClick = () => {
            getGameObjectById("gameProcess").getBehaviour(GameProcess).updateTurn();


            console.log('结束回合 is clicked')

            const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
            //新建一个带有BitmapRenderer的GameObject
            if (getGameObjectById("Map").getBehaviour(MapManagerBehaviour).provinces[0][0].getBehaviour(ProvinceBehaviour).nationId == 1 && this.isTurnOver) {
                console.log("游戏结束");
                tip.getBehaviour(TextPrefabBinding).text = "游戏胜利";
                tip.getBehaviour(TextPrefabBinding).y = 40;
                this.gameObject.children[0].getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Win.png"
                this.gameObject.children[0].getBehaviour(Transform).x=-1730
                this.gameObject.children[0].getBehaviour(Transform).y=-915
            }
            else {
                tip.getBehaviour(TextPrefabBinding).text = "游戏失败";
                tip.getBehaviour(TextPrefabBinding).y = 40;
                console.log(this.gameObject)
                console.log("nationId"+getGameObjectById("Map").getBehaviour(MapManagerBehaviour).provinces[0][0].getBehaviour(ProvinceBehaviour).nationId )
                console.log("isTurnOver"+this.isTurnOver)
                this.gameObject.children[0].getBehaviour(BitmapRenderer).source = "./assets/images/ScreenArt_Defeat.png"
                this.gameObject.children[0].getBehaviour(Transform).x=-1730
                this.gameObject.children[0].getBehaviour(Transform).y=-915
            }
            getGameObjectById("uiRoot").addChild(tip);
            
        }

}
}
