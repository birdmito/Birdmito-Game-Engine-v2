import { transform } from "@ts-morph/common/lib/typescript";
import { TextRenderer } from "../engine/TextRenderer";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";
import { Transform } from "../engine/Transform";

@prefab('./assets/prefabs/text.yaml')
export class TextPrefabBinding extends Binding {
    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(TextRenderer).text = value;
    })
    text: string

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(Transform).x = value;
    })
    x: number

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(Transform).y = value;
    })
    y: number;

    constructor() {
        super();
        makeBinding(this)
    }
}