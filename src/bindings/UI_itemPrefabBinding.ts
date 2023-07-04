import { UI_ItemButton } from "../behaviours/UI_ItemButton";
import { TextRenderer } from "../engine/TextRenderer";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_item.yaml')
export class UI_itemPrefabBinding extends Binding {

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[1].getBehaviour(TextRenderer).text = value;
    })
    itemInfo: string;

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[2].getBehaviour(TextRenderer).text = value;
    })
    itemClickEventText: string;

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[2].getBehaviour(UI_ItemButton).itemName = value;
    })
    item: string;


    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[2].getBehaviour(UI_ItemButton).idInList = value;
    })
    idInList: number;



    constructor() {
        super();
        makeBinding(this)
    }
}