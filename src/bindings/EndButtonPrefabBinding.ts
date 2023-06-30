import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/endButton.yaml')
export class EndButtonPrefabBinding extends Binding {

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(TextRenderer).text = value;
    })
    gameObjectName: string

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