import { Binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_battleInfoWindow.yaml')
export class UI_battleInfoWindowPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}