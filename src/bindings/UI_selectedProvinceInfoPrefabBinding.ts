import { Binding, binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/UI_selectedProvinceInfo.yaml')
export class UI_selectedProvinceInfoPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}