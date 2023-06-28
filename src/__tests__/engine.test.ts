import { describe, expect, it, vi } from "vitest";
import { GameEngine, GameObject } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { GameLifeCycleSystem } from "../engine/systems/GameLifeCycleSystem";

class EmptyBehaviour extends Behaviour {}

describe("engine", () => {
    describe("engine.core", () => {
        it("GameObject should has a engine reference", () => {
            const engine = new GameEngine("play");
            engine.start();
            const obj = new GameObject();
            engine.rootGameObject.addChild(obj);
            expect(obj.engine).toBe(engine);
        });
        it("Behaviour should has a engine reference", () => {
            const engine = new GameEngine("play");
            engine.start();
            const obj = new GameObject();
            class MyBehaviour extends Behaviour {}
            const behaviour = new MyBehaviour();
            engine.rootGameObject.addChild(obj);
            obj.addBehaviour(behaviour);
            expect(behaviour.engine).toBe(engine);
        });
        it("Behaviour should has a gameObject reference 2", () => {
            const engine = new GameEngine("play");
            engine.start();
            const obj = new GameObject();
            const behaviour = new EmptyBehaviour();
            obj.addBehaviour(behaviour);
            engine.rootGameObject.addChild(obj);
            expect(behaviour.gameObject).toBe(obj);
        });
    });

    describe("Behaviour.onStart", () => {
        it("Behaviour.onStart should be called on GameEngine.rootGameObject.addChild(obj)", async () => {
            const engine = new GameEngine("play");
            engine.addSystem(new GameLifeCycleSystem());
            engine.start();
            const obj = new GameObject();
            const behaviour = new EmptyBehaviour();
            const mock = vi.spyOn(behaviour, "onStart");
            obj.addBehaviour(behaviour);
            engine.rootGameObject.addChild(obj);
            expect(mock).toBeCalledTimes(1);
        });
    });
});
