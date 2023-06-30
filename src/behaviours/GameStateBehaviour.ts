import { Binding } from "../bindings/Binding";
import { LoginScenePrefabBinding } from "../bindings/LoginScenePrefabBinding";
import { GamingScenePrefabBinding } from "../bindings/GamingScenePrefabBinding";
import { Behaviour } from "../engine/Behaviour";
import { getGameObjectById } from "../engine";
import { UI_gamingStaticPrefabBinding } from "../bindings/UI_gamingStaticPrefabBinding";

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
        if (this.gameObject.children[0]) {
            this.gameObject.removeChild(this.gameObject.children[0]);
        }

        //删除旧场景配套UI
        if (getGameObjectById("uiRoot").children.length > 0) {
            console.log("uiRoot has " + getGameObjectById("uiRoot").children.length + " children");
            for (const child of getGameObjectById("uiRoot").children) {
                console.log("destroy " + child.id);
                child.destroy();
            }
        }

        //创建新场景
        const newScene = this.gameObject.engine.createPrefab(this.scenePrefabBindings[gameState]);
        this.gameObject.addChild(newScene);

        //生成新场景的静态UI
        switch (gameState) {
            case 1:
                this.gameObject.engine.createPrefab2Children(new UI_gamingStaticPrefabBinding(), getGameObjectById("uiRoot"));
                break;
            default:
                break;
        }
    }
}
