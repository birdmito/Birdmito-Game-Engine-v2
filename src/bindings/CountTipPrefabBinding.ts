import { Binding, binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/countTip.yaml')
export class CountTipPrefabButtonBinding extends Binding {

    constructor() {
        super();
        makeBinding(this)
    }
}