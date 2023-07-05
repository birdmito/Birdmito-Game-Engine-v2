import { Binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_techWindow.yaml')
export class UI_techWindowPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}