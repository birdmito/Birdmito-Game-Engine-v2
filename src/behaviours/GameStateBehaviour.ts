import { Binding } from "../bindings/Binding";
import { LoginScenePrefabBinding } from "../bindings/LoginScenePrefabBinding";
import { GamingScenePrefabBinding } from "../bindings/GamingScenePrefabBinding";
import { Behaviour } from "../engine/Behaviour";

export class GameStateBehaviour extends Behaviour {
    gameState: number = 0;

    onStart(): void {
        console.log("open login panel");
        this.changeGameState(0);
    }

    scenePrefabBindings: Binding[] = [
        new LoginScenePrefabBinding(),
        new GamingScenePrefabBinding()
    ]

    //挂在sceneRoot上的脚本，用于实现切换场景
    changeGameState(gameState: number) {
        console.log("change scene to " + gameState);
        //删除旧场景
        if (this.gameObject.children[0])
            this.gameObject.removeChild(this.gameObject.children[0]);
        //创建新场景
        const newScene = this.gameObject.engine.createPrefab(this.scenePrefabBindings[gameState]);
        this.gameObject.addChild(newScene);
    }
}
