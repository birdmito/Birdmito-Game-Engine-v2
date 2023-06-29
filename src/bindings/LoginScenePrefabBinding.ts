import { RigidBody } from "../behaviours/RigidBody";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/scenes/login-scene.yaml')
export class LoginScenePrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}