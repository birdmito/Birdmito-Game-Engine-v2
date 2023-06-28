import { GameEngine, GameObject } from "../../engine";
import { Behaviour } from "../Behaviour";

export class System {


    rootGameObject: GameObject;
    gameEngine: GameEngine;

    /**
     * 在任意一个 Component 被添加到场景上时触发
     * @param gameObject 
     * @param component 
     */
    onAddComponent(gameObject: GameObject, component: Behaviour) {

    }

    /**
     * 在任意一个 Component 从场景中移除时触发
     * @param gameObject 
     * @param component 
     */
    onRemoveComponent(gameObject: GameObject, component: Behaviour) {

    }

    onStart() {

    }

    onTick(duringTime: number) {

    }

    onUpdate() {

    }

    onLaterUpdate() {

    }

    onEnd() {

    }
}