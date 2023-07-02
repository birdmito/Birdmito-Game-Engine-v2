import { Province } from "../behaviours/Province";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/province.yaml')
export class ProvincePrefabBinding extends Binding {
    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(Province).nationId = value;
    })
    nationId: number;

    constructor() {
        super();
        makeBinding(this)
    }
}