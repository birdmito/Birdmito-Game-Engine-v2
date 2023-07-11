import { PhysicsSystem } from "./PhysicsSystem";
import { GameEngine } from "./engine";
import { AnchorSystem } from "./engine/systems/AnchorSystem";
import { AnimationSystem } from "./engine/systems/AnimationSystem";
import { AudioSystem } from "./engine/systems/AudioSystem";
import { EditorSystem } from "./engine/systems/EditorSystem";
import { GameLifeCycleSystem } from "./engine/systems/GameLifeCycleSystem";
import { GamePlaySystem } from "./engine/systems/GamePlaySystem";
import { MouseControlSystem } from "./engine/systems/MouseControlSystem";
import { CanvasContextRenderingSystem } from "./engine/systems/RenderingSystem";
import { TransformSystem } from "./engine/systems/TransformSystem";
import { registerAllSourceCodes } from "./register";

async function startup() {
    registerAllSourceCodes();
    const mode = getQuery().mode;
    const prefab = getQuery().prefab;
    const engine = new GameEngine(mode);
    engine.defaultSceneName = prefab;

    if (mode === "edit") {
        engine.addSystem(new EditorSystem());
    } 
    else if(mode === "preview"){
        engine.addSystem(new GameLifeCycleSystem());
        engine.addSystem(new EditorSystem());
        engine.addSystem(new AudioSystem());
    }
    else{
        engine.addSystem(new GameLifeCycleSystem());
        engine.addSystem(new AudioSystem());
    }
    engine.addSystem(new TransformSystem());
    if (engine.mode === "play") {
        engine.addSystem(new GamePlaySystem());
    }
    engine.addSystem(new AnimationSystem());
    engine.addSystem(new CanvasContextRenderingSystem());
    engine.addSystem(new AnchorSystem())
    engine.addSystem(new PhysicsSystem());
    engine.addSystem(new MouseControlSystem());

    await engine.loadAssets();
    engine.changeScene(prefab);
    engine.start();

    const onEnterFrame = (advancedTime: number) => {
        engine.enterFrame(advancedTime);
        requestAnimationFrame(onEnterFrame);
    };
    requestAnimationFrame(onEnterFrame);
}
function getQuery(): { [key: string]: string } {
    let result = {};
    const search = window.location.search;
    if (search) {
        const queryString = search.substring(1);
        const tempArr = queryString.split("&");
        for (const kv of tempArr) {
            const [k, v] = kv.split("=");
            result[k] = decodeURIComponent(v);
        }
    }
    return result;
}

startup();
