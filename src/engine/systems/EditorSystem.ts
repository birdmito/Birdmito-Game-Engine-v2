import { b2DrawFlags } from "@flyover/box2d";
import config from "../../../config.json";
import { Camera } from "../../behaviours/Camera";
import { PhysicsWorld } from "../../behaviours/unneed/PhysicsWorld";
import { DebugDraw } from "../../draw";
import {
    GameObject,
    getAllComponentDefinationNames,
    getBehaviourClassByName,
    getGameObjectById,
} from "../../engine";
import { RuntimeHost } from "../../host";
import { PhysicsSystem } from "../../PhysicsSystem";
import { GameObjectComponents, GameObjectInfo } from "../../types";
import { Behaviour } from "../Behaviour";
import { matrixAppendMatrix } from "../math";
import { Transform } from "../Transform";
import { System } from "./System";

export class EditorSystem extends System {
    private context: CanvasRenderingContext2D;
    private physicsWorldTransform: Transform = new Transform();
    constructor() {
        super();
        const canvas = document.getElementById("game") as HTMLCanvasElement;
        this.context = canvas.getContext("2d");
    }

    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof PhysicsWorld) {
            this.physicsWorldTransform = gameObject.getBehaviour(Transform);
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof PhysicsWorld) {
            this.physicsWorldTransform = new Transform();
        }
    }

    onStart(): void {
        const host = new RuntimeHost();
        const engine = this.gameEngine;
        const transform = engine.editorGameObject.getBehaviour(Transform);
        const camera = new Camera();
        camera.viewportWidth = config.editor.runtime.width;
        camera.viewportHeight = config.editor.runtime.height;
        engine.editorGameObject.addBehaviour(camera);

        const debugDraw = new DebugDraw();
        debugDraw.m_ctx = this.context;
        let flags = b2DrawFlags.e_none;
        flags |= b2DrawFlags.e_shapeBit;
        debugDraw.SetFlags(flags);
        this.gameEngine.getSystem(PhysicsSystem).setDebugDraw(debugDraw);

        window.addEventListener("keydown", (event) => {
            const code = event.code;
            const scale = event.shiftKey ? 10 : 1;
            if (code === "KeyW") {
                transform.y -= 10 * scale;
            } else if (code === "KeyS") {
                transform.y += 10 * scale;
            } else if (code === "KeyA") {
                transform.x -= 10 * scale;
            } else if (code === "KeyD") {
                transform.x += 10 * scale;
            }
        });

        const getSceneSerializedData = () => {
            const content = engine.serilize(this.rootGameObject.children[0]);
            const filePath = engine.defaultSceneName;
            return { content, filePath };
        };
        const getAllGameObjects = () => {
            function createGameObjectInfo(gameObject: GameObject, info: GameObjectInfo[]) {
                const children = gameObject.children || [];
                for (const child of children) {
                    const childrenInfo: GameObjectInfo[] = [];
                    let gameObjectName = child.id || "GameObject";
                    if (child.prefabData) {
                        gameObjectName += " (Prefab)";
                    }
                    info.push({ name: gameObjectName, children: childrenInfo, uuid: child.uuid });
                    createGameObjectInfo(child, childrenInfo);
                }
                return info;
            }

            return createGameObjectInfo(this.rootGameObject, []);
        };
        const getAllComponentsByGameObjectUUID = (gameObjectUUID: number) => {
            const gameObject = GameObject.map[gameObjectUUID];
            const allComponents: GameObjectComponents = gameObject.behaviours.map((b) => {
                const componentName = (b as any).__proto__.constructor.name;
                const properties: GameObjectComponents[0]["properties"] = [];
                const behaviourClass = (b as any).__proto__;
                const __metadatas = behaviourClass.__metadatas || [];
                for (const metadata of __metadatas) {
                    const name = metadata.key;
                    const type = metadata.type || "string";
                    const editorType = metadata.editorType || "textfield";
                    const options = metadata.options;
                    properties.push({ name, value: b[name], type, editorType, options });
                }
                return {
                    name: componentName,
                    properties: properties,
                };
            });
            return allComponents;
        };
        const modifyComponentProperty = (param: any) => {
            const { gameObjectUUID, componentName, propertyName, value } = param;
            const gameObject = GameObject.map[gameObjectUUID];
            const component = gameObject.behaviours.find((b) => {
                return componentName === (b as any).__proto__.constructor.name;
            });
            component[propertyName] = value;
            console.log(param);
        };

        const getAllComponentDefinations = (gameObjectUUID) => {
            const gameObject = GameObject.map[gameObjectUUID];
            const allComponentNames = getAllComponentDefinationNames();
            const existedComponentsName = gameObject.behaviours.map((behaviour) => {
                return (behaviour as any).__proto__.constructor.name;
            });
            const groupedComponentsLimitation = [
                ["BoxCollider", "EdgeCollider", "CircleCollider"],
                ["TextRenderer", "ShapeRectRenderer"],
            ];
            let ignoreComponentNames = existedComponentsName;
            for (const component of existedComponentsName) {
                const peer = groupedComponentsLimitation.find((peers) => peers.includes(component));
                if (peer) {
                    ignoreComponentNames = ignoreComponentNames.concat(peer);
                }
            }

            return allComponentNames
                .filter((componentName) => !ignoreComponentNames.includes(componentName))
                .map((componentName) => {
                    return { name: componentName };
                });
        };

        const addComponentToGameObject = (data: { gameObjectUUID: number; componentName: string }) => {
            const gameObject = GameObject.map[data.gameObjectUUID];
            const behaviourClass = getBehaviourClassByName(data.componentName);
            gameObject.addBehaviour(new behaviourClass());
        };

        const removeComponentFromGameObject = (data: { gameObjectUUID: number; componentName: string }) => {
            const gameObject = GameObject.map[data.gameObjectUUID];
            const behaviourClass = getBehaviourClassByName(data.componentName);
            const behaviour = gameObject.getBehaviour(behaviourClass);
            gameObject.removeBehaviour(behaviour);
        };

        host.registerCommand(getSceneSerializedData);
        host.registerCommand(getAllGameObjects);
        host.registerCommand(getAllComponentsByGameObjectUUID);
        host.registerCommand(modifyComponentProperty);
        host.registerCommand(getAllComponentDefinations);
        host.registerCommand(addComponentToGameObject);
        host.registerCommand(removeComponentFromGameObject);
        host.start();
    }

    onUpdate(): void {
        this.drawEditorBackground();
        this.drawPlayerCamera();
    }

    onLaterUpdate(): void {
        this.drawPhysicsDebug();
    }

    drawPhysicsDebug() {
        const physicsSystem = this.gameEngine.getSystem(PhysicsSystem as any) as PhysicsSystem;
        this.context.save();
        const viewportMatrix = this.gameEngine.editorGameObject
            .getBehaviour(Camera)
            .calculateViewportMatrix();
        const matrix = matrixAppendMatrix(this.physicsWorldTransform.globalMatrix, viewportMatrix);
        this.context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.context.scale(DebugDraw.EXTENT, -DebugDraw.EXTENT);
        this.context.lineWidth = 1 / DebugDraw.EXTENT;
        // this.context.setTransform(1, 0, 0, 1, 0, 0)
        // this.context.translate(0.5 * this.context.canvas.width, 0.5 * this.context.canvas.height);
        // this.context.scale(1, -1);
        physicsSystem.m_world.DrawDebugData();
        this.context.restore();
    }

    drawPlayerCamera() {
        const context = this.context;
        const cameraGameObject = getGameObjectById("camera");
        if (cameraGameObject) {
            context.save();
            const playerCameraTransform = cameraGameObject.getBehaviour(Transform);
            const playerCamera = cameraGameObject.getBehaviour(Camera);
            const viewportMatrix = this.gameEngine.editorGameObject
                .getBehaviour(Camera)
                .calculateViewportMatrix();
            const matrix = matrixAppendMatrix(playerCameraTransform.globalMatrix, viewportMatrix);
            context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            context.beginPath();
            context.rect(
                -playerCamera.viewportWidth / 2,
                -playerCamera.viewportHeight / 2,
                playerCamera.viewportWidth,
                playerCamera.viewportHeight
            );
            context.fillStyle = "#99660033";
            context.strokeStyle = "orange";
            context.lineWidth = 2;
            context.stroke();
            context.fill();
            context.restore();
        }
    }

    drawEditorBackground() {
        const viewportMatrix = this.gameEngine.editorGameObject
            .getBehaviour(Camera)
            .calculateViewportMatrix();
        const context = this.context;
        context.save();
        context.setTransform(
            viewportMatrix.a,
            viewportMatrix.b,
            viewportMatrix.c,
            viewportMatrix.d,
            viewportMatrix.tx,
            viewportMatrix.ty
        );

        const texture = document.createElement("canvas");
        texture.width = texture.height = 100;
        const textureContext = texture.getContext("2d");
        textureContext.fillStyle = "#CCCCCC";
        textureContext.fillRect(0, 0, 100, 100);
        textureContext.fillStyle = "#999999";
        textureContext.fillRect(0, 0, 50, 50);
        textureContext.fillRect(50, 50, 100, 100);

        const pattern = context.createPattern(texture, "repeat");
        context.fillStyle = pattern;
        context.fillRect(-1000, -1000, 2000, 2000);

        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(-1000, 0);
        context.lineTo(1000, 0);
        context.moveTo(0, -1000);
        context.lineTo(0, 1000);
        context.stroke();
        context.restore();
    }
}
