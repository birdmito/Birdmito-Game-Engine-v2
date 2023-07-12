import { MiniProvinceBehaviour } from "../behaviours/MiniProvinceBehaviour";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/miniProvince.yaml')
export class MiniProvincePreBinding extends Binding {

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(MiniProvinceBehaviour).nationId = value;
    })
    nationId: number;

    constructor() {
        super();
        makeBinding(this)
    }
}