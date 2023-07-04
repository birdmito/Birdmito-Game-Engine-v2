import { UnitBehaviour } from "../behaviours/UnitBehaviour";
import { UnitParam } from "../behaviours/UnitParam";
import { TextRenderer } from "../engine/TextRenderer";
import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { binding, Binding, makeBinding, prefab } from "./Binding";

@prefab('./assets/prefabs/unit.yaml')
export class UnitPrefabBinding extends Binding {

    // @string()
    // @binding((prefabRoot, value) => {
    //     prefabRoot.getBehaviour(TextRenderer).text = value;
    // })
    // soilderName: string

    // @number()
    // @binding((prefabRoot, value) => {
    //     prefabRoot.getBehaviour(Soilder).nationId = value;
    //     prefabRoot.getBehaviour(Transform).x = value;
    // })
    // x: number;


    constructor() {
        super();
        makeBinding(this)
    }
}
