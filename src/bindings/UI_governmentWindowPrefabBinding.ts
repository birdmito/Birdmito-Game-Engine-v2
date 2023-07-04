import { Binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_governmentWindow.yaml')
export class UI_governmentWindowPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}