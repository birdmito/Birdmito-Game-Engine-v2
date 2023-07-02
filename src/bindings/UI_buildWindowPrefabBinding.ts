import { Binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_buildWindow.yaml')
export class UI_buildWindowPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}