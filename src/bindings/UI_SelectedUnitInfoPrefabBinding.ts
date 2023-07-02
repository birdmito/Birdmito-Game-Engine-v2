import { Binding, binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/UI_selectedUnitInfo.yaml')
export class UI_selectedUnitInfoPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}