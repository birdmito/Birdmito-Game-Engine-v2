import {
    b2Contact,
    b2ContactImpulse,
    b2ContactListener,
    b2Manifold,
    b2ParticleBodyContact,
    b2ParticleContact,
    b2ParticleSystem,
    b2Shape,
} from "@flyover/box2d";
import { BlockPrefabBinding } from "../../bindings/BlockPrefabBinding";
import { MainRolePrefabBinding } from "../../bindings/MainRolePrefabBinding";
import { GameObject, getGameObjectById } from "../../engine";
import { PhysicsSystem } from "../../PhysicsSystem";
import { System } from "./System";
import { ButtonBinding } from "../../bindings/ButtonBinding";
import { Transform } from "../Transform";
import { Camera } from "../../behaviours/Camera";
import config from "../../../config.json";
import { gameObjects } from "../../engine";
import { CameraController } from "../../behaviours/CameraController";
import { GameStateBehaviour } from "../../behaviours/GameStateBehaviour";
import { Point, Hexagon, checkPointInHexagon } from "../math";

export class GamePlaySystem extends System {
    onStart(): void {
        // const point: Point = { x: 5 , y: 0.2 };
        // const hexagon: Hexagon = { x: 0, y: 0, circumradius: 2 };
        // console.warn(checkPointInHexagon(point, hexagon));

        if(getGameObjectById("Camera")){
            console.log("no need for camera");
            return;    
        }

        const root = this.rootGameObject.children[0];

        const cameraBehaviour = new Camera();
        cameraBehaviour.viewportWidth = config.editor.runtime.width;
        cameraBehaviour.viewportHeight = config.editor.runtime.height;

        const mainCamera = new GameObject();
        mainCamera.id = "Camera";
        mainCamera.addBehaviour(new Transform());
        mainCamera.addBehaviour(cameraBehaviour);

        gameObjects["Camera"] = mainCamera;

        root.addChild(mainCamera);

        // console.log(root);
    }
    //OPTIMIZE  
    isPrefab = false;   
    onUpdate(): void {
        // (rootGameObject) -> Root ? 没有说明是预制体   
        if(this.isPrefab){
            return;
        }   
        if(!this.rootGameObject.getChildById("Root")){
            this.isPrefab = true;
            return;
        }

        // (rootGameObject) -> Root -> sceneRoot
        const sceneState = this.rootGameObject.children[0].children[0].getBehaviour(GameStateBehaviour).gameState;
        const camera = getGameObjectById("Camera");

        switch(sceneState){
            case 0:
                this.removeCameraController(camera);
                break;
            case 1:
                this.addCameraController(camera);
                break;
            default:
                break;
        }


    }

    addCameraController(camera: GameObject){
        if(!camera.getBehaviour(CameraController)){
            camera.addBehaviour(new CameraController());
            console.log("add camera controller")
        }
    }
    removeCameraController(camera: GameObject){
        const cameraController = camera.getBehaviour(CameraController);
        if(cameraController){
            camera.removeBehaviour(cameraController);
            console.log("remove camera controller");
            console.log(camera);
        }
    }

}

export class GamePlaySystem1 extends System {
    onStart(): void {
        console.log("开始游戏");

        const scene = getGameObjectById("sceneRoot");
        const buttonBinding = new ButtonBinding();
        buttonBinding.text = "按钮";
        buttonBinding.image = "./assets/images/icon.jpg";
        const buttonGameObject = this.gameEngine.createPrefab(buttonBinding);

        scene.addChild(buttonGameObject);
    }
}

export class GamePlaySystemWangze extends System implements b2ContactListener {
    onStart(): void {
        console.log("开始游戏");

        // this.gameEngine.getSystem(PhysicsSystem).SetContactListener(this);

        // const scene = getGameObjectById("sceneRoot");
        // const blockBinding = new BlockPrefabBinding();
        // blockBinding.x = 100;
        // blockBinding.y = 90;
        // const blockGameObject = this.gameEngine.createPrefab(blockBinding);
        // scene.addChild(blockGameObject);

        // setTimeout(() => {
        //     scene.removeChild(blockGameObject);
        // }, 3000);
    }

    onUpdate(): void {
        // const cameraGameObject = getGameObjectById('camera');
        // const transform = cameraGameObject.getBehaviour(Transform)
        // transform.x += 1;
    }

    public BeginContact(contact: b2Contact<b2Shape, b2Shape>): void {
        const bodyA = contact.GetFixtureA().GetBody();
        const bodyB = contact.GetFixtureB().GetBody();
        const mainRole = getGameObjectById("mainRole");
        if (bodyA.GetUserData() === mainRole || bodyB.GetUserData() === mainRole) {
            mainRole.getBehaviour(MainRolePrefabBinding).action = "left";
            // mainRole.parent.removeChild(mainRole)
        }
    }
    public EndContact(contact: b2Contact<b2Shape, b2Shape>): void {}
    public PreSolve(contact: b2Contact<b2Shape, b2Shape>, oldManifold: b2Manifold): void {}
    public PostSolve(contact: b2Contact<b2Shape, b2Shape>, impulse: b2ContactImpulse): void {}

    public BeginContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void {}
    public EndContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void {}
    public BeginContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void {}
    public EndContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void {}
}
