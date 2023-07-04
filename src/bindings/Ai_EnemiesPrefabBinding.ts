import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/AI_Enemies.yaml')
export class Ai_EnemiesPrefabBinding extends Binding {

    // @number()
    // @binding((prefabRoot, value) => {
    //     prefabRoot.getBehaviour(Transform).x = value;
    // })
    // x: number;

    // @number()
    // @binding((prefabRoot, value) => {
    //     prefabRoot.getBehaviour(Transform).y = value;
    // })
    // y: number;

    constructor() {
        super();
        makeBinding(this)
    }
}