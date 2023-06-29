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
import { getGameObjectById } from "../../engine";
import { PhysicsSystem } from "../../PhysicsSystem";
import { System } from "./System";

export class GamePlaySystem1 extends System {
    onStart(): void {
        console.log("开始游戏");
    }
}

export class GamePlaySystem extends System implements b2ContactListener {
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
