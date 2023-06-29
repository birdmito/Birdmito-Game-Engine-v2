import { Binding } from "../bindings/Binding";
import { Behaviour } from "../engine/Behaviour";

export class _DemoBehaviour extends Behaviour {
    scenePrefabBindings: Binding[] = [
        
    ]

    //挂在sceneRoot上的脚本，用于实现切换场景
    changeScene(newScenePrefabBinding: Binding) {
        //删除旧场景
        this.gameObject.removeChild(this.gameObject.children[0]);
        //创建新场景
        const newScene = this.gameObject.engine.createPrefab(newScenePrefabBinding);
    }
}
