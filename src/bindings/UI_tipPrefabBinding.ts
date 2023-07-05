import { SelfDestroy } from "../behaviours/SelfDestroy";
import { RigidBody } from "../behaviours/unneed/RigidBody";
import { TextRenderer } from "../engine/TextRenderer";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_tip.yaml')
export class UI_tipPrefabBinding extends Binding {
    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getChildById("tipText").getBehaviour(TextRenderer).text = value;
    })
    tipText: string;

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(SelfDestroy).delay = value;
    })
    delay: number;

    constructor() {
        super();
        makeBinding(this)
    }
}