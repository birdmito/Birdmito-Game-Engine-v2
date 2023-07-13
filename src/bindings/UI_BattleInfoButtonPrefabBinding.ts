import { RigidBody } from "../behaviours/unneed/RigidBody";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_BattleInfoButton.yaml')
export class UI_BattleInfoButtonPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}