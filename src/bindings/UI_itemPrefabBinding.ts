import { UI_ItemButton } from "../behaviours/UI_ItemButton";
import { UI_UpdateItemInfo } from "../behaviours/UI_UpdateItemInfo";
import { TextRenderer } from "../engine/TextRenderer";
import { number } from "../engine/validators/number";
import { string } from "../engine/validators/string";
import { Binding, binding, makeBinding, prefab } from "./Binding";
@prefab('./assets/prefabs/UI_item.yaml')
export class UI_itemPrefabBinding extends Binding {
    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getChildById("_ItemButton").getBehaviour(UI_ItemButton).eventText = value;
    })
    itemClickEventText: string;

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.children[2].getBehaviour(UI_ItemButton).itemName = value;
        prefabRoot.getChildById("_ItemInfo").getBehaviour(UI_UpdateItemInfo).itemName = value;
    })
    item: string;

    @string()
    @binding((prefabRoot, value) => {
        prefabRoot.getChildById("_ItemButton").getBehaviour(UI_ItemButton).idInList = value;
    })
    idInList: number;


    constructor() {
        super();
        makeBinding(this)
    }
}