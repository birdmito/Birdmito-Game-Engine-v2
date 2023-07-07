
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/miniMapBox.yaml')
export class MiniMapBoxPrefabBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}