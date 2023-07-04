import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/scrollbar.yaml')
export class ScrollBarPrefabBinding extends Binding {

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

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.children[0].getBehaviour(Transform).x = value;
    })
    TextX: number;

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.children[0].getBehaviour(Transform).y = value;
    })
    TextY: number;

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.children[1].getBehaviour(Transform).x = value;
    })
    BarX: number;

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.children[1].getBehaviour(Transform).y = value;
    })
    barY: number;

    constructor() {
        super();
        makeBinding(this)
    }
}