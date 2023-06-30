import { TextRenderer } from "../engine/TextRenderer";
import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/text.yaml')
export class TextPrefabBinding extends Binding {
    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(TextRenderer).text = value;
    })
    text: string

    constructor() {
        super();
        makeBinding(this)
    }
}