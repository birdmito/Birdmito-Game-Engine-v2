import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";
import { BitmapRenderer } from "../engine/BitmapRenderer";
import { TextRenderer } from "../engine/TextRenderer";
@prefab('./assets/prefabs/button.yaml')
export class ButtonBinding extends Binding {

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(BitmapRenderer).source = value;
    })
    image: string;

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(TextRenderer).text = value;
    })
    text: string;

    constructor() {
        super();
        makeBinding(this)
    }
}