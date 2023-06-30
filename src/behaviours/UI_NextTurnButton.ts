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

export class UI_NextTurnButton extends Behaviour {

    isTurnOver : boolean = false

    onUpdate(): void {
        this.gameObject.onClick = () => {
            getGameObjectById("gameProcess").getBehaviour(GameProcess).updateTurn();


            console.log('结束回合 is clicked')

            const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
            if (getGameObjectById("Map").getBehaviour(MapManagerBehaviour).provinces[0][0].getBehaviour(ProvinceBehaviour).nationId == 1 && this.isTurnOver) {
                tip.getBehaviour(TextPrefabBinding).text = "游戏胜利";
                tip.getBehaviour(TextPrefabBinding).y = 40;
            }
            else {
                tip.getBehaviour(TextPrefabBinding).text = "游戏失败";
                tip.getBehaviour(TextPrefabBinding).y = 40;
            }
            getGameObjectById("uiRoot").addChild(tip);
            
        }

}
}
