import { Behaviour } from "../engine/Behaviour";
import { UI_tipPrefabBinding } from "../bindings/UI_tipPrefabBinding";
import { getGameObjectById } from "../engine";

export function generateTip(behaviour: Behaviour, text: string) {
    const engine = behaviour.engine;
    //生成提示
    const tipPrefab = behaviour.engine.createPrefab(new UI_tipPrefabBinding);
    tipPrefab.getBehaviour(UI_tipPrefabBinding).tipText = text;
    getGameObjectById("uiRoot").addChild(tipPrefab);
}