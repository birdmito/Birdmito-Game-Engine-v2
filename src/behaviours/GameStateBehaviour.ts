import { Binding } from "../bindings/Binding";
import { LoginScenePrefabBinding } from "../bindings/LoginScenePrefabBinding";
import { GamingScenePrefabBinding } from "../bindings/GamingScenePrefabBinding";
import { Behaviour } from "../engine/Behaviour";
import { getGameObjectById } from "../engine";
import { UI_gamingStaticPrefabBinding } from "../bindings/UI_gamingStaticPrefabBinding";
import { MiniMapBoxPrefabBinding } from "../bindings/MiniMapBoxPrefabBinding";
import { Camera } from "./Camera";

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
        const uiRoot = getGameObjectById("uiRoot");
        if (uiRoot.children.length > 0) {
            console.log("uiRoot has " + uiRoot.children.length + " children");
            for (let i = uiRoot.children.length - 1; i >= 0; i--) {
                console.log(i);
                console.log("destroy " + uiRoot.children[i].id);
                uiRoot.removeChild(uiRoot.children[i]);
                console.log(uiRoot);
            }
        }

        //获取摄像机
        const camera = getGameObjectById("Camera");
        
        //删除旧场景小地图
        if(camera.getChildById("MiniMapRoot")){
            camera.removeChild(camera.getChildById("MiniMapRoot"));
        }

        //创建新的小地图
        switch (gameState) {
            case 1:
                this.gameObject.engine.createPrefab2Children(new MiniMapBoxPrefabBinding(),camera);
                break;
            default:
                break;    
        }

        //创建新场景
        const newScene = this.gameObject.engine.createPrefab(this.scenePrefabBindings[gameState]);
        this.gameObject.addChild(newScene);        

        //生成新场景的静态UI
        switch (gameState) {
            case 1:
                this.gameObject.engine.createPrefab2Children(new UI_gamingStaticPrefabBinding(), uiRoot);
                break;
            default:
                break;
        }

        this.gameState = gameState;
    }
}
