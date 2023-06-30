import { colonyPrefabButtonBinding } from "../bindings/ColonyButtonPrefabBinding";
import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { getBehaviourClassByName, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ColonyBehaviour } from "./ColonyBehaviour";
import { InitialMapBehaviour } from "./InitialMapBehaviour";
import { ProvinceBehaviour } from "./ProvinceBehaviour";
import { RoundDisplayBehaviour } from "./RoundDisplayBehaviour";

export class EndButtonBehaviour extends Behaviour {

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log('结束回合 is clicked')
            const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
            if (getGameObjectById("Map").getBehaviour(InitialMapBehaviour).provinces[0][0].getBehaviour(ProvinceBehaviour).nationId == 1) {
                tip.getBehaviour(TextPrefabBinding).text = "游戏胜利";
            }
            else {
                tip.getBehaviour(TextPrefabBinding).text = "游戏失败";
            }
            getGameObjectById("uiRoot").addChild(tip);
            getGameObjectById("RoundDisplay").getBehaviour(RoundDisplayBehaviour).changeRoundTip()
        }

}
}
