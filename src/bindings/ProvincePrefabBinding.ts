import { ProvinceBehaviour } from "../behaviours/ProvinceBehaviour";
import { RigidBody } from "../behaviours/RigidBody";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/province.yaml')
export class ProvincePrefabBinding extends Binding {
    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(ProvinceBehaviour).nationId = value;
    })
    nationId: number;

    constructor() {
        super();
        makeBinding(this)
    }
}