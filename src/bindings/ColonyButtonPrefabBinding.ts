import { Binding, binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/colonyButton.yaml')
export class colonyPrefabButtonBinding extends Binding {

    constructor() {
        super();
        makeBinding(this)
    }
}