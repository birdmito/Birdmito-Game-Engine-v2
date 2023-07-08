import { Binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_GameOver.yaml')
export class UI_GameOverBinding extends Binding {
    constructor() {
        super();
        makeBinding(this)
    }
}