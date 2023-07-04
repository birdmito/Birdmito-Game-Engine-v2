import { Binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_productWindow.yaml')
export class UI_productWindowPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}