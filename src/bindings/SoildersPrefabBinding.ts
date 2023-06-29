import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { binding, Binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/soilders.yaml')
export class SoildersPrefabBinding extends Binding {

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(TextRenderer).text = value;
    })
    soilderName: string

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(Transform).x = value;
    })
    x: number;

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
