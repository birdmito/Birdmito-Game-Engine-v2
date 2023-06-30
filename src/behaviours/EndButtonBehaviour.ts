import { colonyPrefabButtonBinding } from "../bindings/ColonyButtonPrefabBinding";
import { TextPrefabBinding } from "../bindings/TextPrefabBinding";
import { getBehaviourClassByName, getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ColonyBehaviour } from "./ColonyBehaviour";
import { MapManagerBehaviour } from "./MapManagerBehaviour";
import { ProvinceBehaviour } from "./ProvinceBehaviour";
import { RoundDisplayBehaviour } from "./RoundDisplayBehaviour";

export class EndButtonBehaviour extends Behaviour {

    Isroundover : boolean = false

    onUpdate(): void {
        this.gameObject.onClick = () => {

            // const gameTip = this.gameObject.engine.createPrefab(new TextPrefabBinding)

            if(getGameObjectById("RoundDisplay").getBehaviour(RoundDisplayBehaviour).roundNum < 
                getGameObjectById("RoundDisplay").getBehaviour(RoundDisplayBehaviour).roundTotalNum ){
                    
                    getGameObjectById("RoundDisplay").getBehaviour(RoundDisplayBehaviour).changeRoundTip()
                    this.Isroundover = false
                }
            else{
                this.Isroundover = true 
            }


            console.log('结束回合 is clicked')

            const tip = this.gameObject.engine.createPrefab(new TextPrefabBinding)
            if (getGameObjectById("Map").getBehaviour(InitialMapBehaviour).provinces[0][0].getBehaviour(ProvinceBehaviour).nationId == 1 && this.Isroundover) {
                tip.getBehaviour(TextPrefabBinding).text = "游戏胜利";
                tip.getBehaviour(TextPrefabBinding).y = 40
            }
            else {
                tip.getBehaviour(TextPrefabBinding).text = "游戏失败";
                tip.getBehaviour(TextPrefabBinding).y = 40
            }
            getGameObjectById("uiRoot").addChild(tip);

        }

}
}
