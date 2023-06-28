import { RigidBody } from "../behaviours/RigidBody";
import { AnimationRenderer } from "../engine/AnimationRenderer";
import { TextRenderer } from "../engine/TextRenderer";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { binding, Binding, makeBinding, prefab } from "./Binding";


@prefab('./assets/prefabs/mainRole.yaml')
export class MainRolePrefabBinding extends Binding {


    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[1].getBehaviour(TextRenderer).text = value;
    })
    userName: string

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[0].getBehaviour(AnimationRenderer).action = value;
    })
    action: string;

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(RigidBody).x = value;
    })
    x: number;

    @number()
    @binding((prefabRoot, value) => {
        prefabRoot.getBehaviour(RigidBody).y = value;
    })
    y: number;


    constructor() {
        super();
        makeBinding(this)
    }
}