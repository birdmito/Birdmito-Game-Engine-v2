import { colonyPrefabButtonBinding } from "../bindings/ColonyButtonPrefabBinding";
import { CountTipPrefabButtonBinding } from "../bindings/CountTipPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { ColonyBehaviour } from "./ColonyBehaviour";
import { InitialMapBehaviour } from "./InitialMapBehaviour";

export class EndButtonBehaviour extends Behaviour {

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log('结束回合 is clicked')
            const tip =  this.gameObject.engine.createPrefab(new CountTipPrefabButtonBinding)
            getGameObjectById("ui").addChild(tip);
        }
    }

}
