import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_StaffWindow.yaml')
export class UI_StaffWindowPrefabBinding extends Binding {

    constructor() {
        super();
        makeBinding(this)
    }
}