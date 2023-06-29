import { colonyPrefabButtonBinding } from "../bindings/ColonyButtonPrefabBinding";
import { getGameObjectById } from "../engine";
import { Behaviour } from "../engine/Behaviour";

export class SoilderFunction extends Behaviour{

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log('soilder is cliceked')
            const cbutton = this.gameObject.engine.createPrefab( new colonyPrefabButtonBinding);
            getGameObjectById("ui").addChild(cbutton);
        }
    }
}