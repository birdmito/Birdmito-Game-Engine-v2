import { UI_BuildingButton } from "../behaviours/UI_BuildingButton";
import { TextRenderer } from "../engine/TextRenderer";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_building.yaml')
export class UI_buildingPrefabBinding extends Binding {

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[1].getBehaviour(TextRenderer).text = value;
    })
    buildingInfo: string;

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[2].getBehaviour(TextRenderer).text = value;
    })
    buildingEventText: string;

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[2].getBehaviour(UI_BuildingButton).buildingName = value;
    })
    buildingName: string;



    constructor() {
        super();
        makeBinding(this)
    }
}