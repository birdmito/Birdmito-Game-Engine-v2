import { RigidBody } from "../behaviours/unneed/RigidBody";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/scenes/gaming-scene.yaml')
export class GamingScenePrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}