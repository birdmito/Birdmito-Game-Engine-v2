import { s } from "vitest/dist/types-2b1c412e";
import { Camera } from "../../behaviours/Camera";
import { GameEngineMouseEvent, GameObject, getGameObjectById } from "../../engine";
import { checkPointInHexagon, checkPointInRectangle, Hexagon, invertMatrix, Point, pointAppendMatrix } from "../math";
import { Transform } from "../Transform";
import { System } from "./System";


export class MouseControlSystem extends System {
    private callback(event: GameEngineMouseEvent) { }
    private currentHoverGameObject: GameObject | null = null;
    onStart() {
        window.addEventListener('mousedown', (event) => {
            const code = event.button;

            const cameraGameObject = this.gameEngine.mode === 'play' ? getGameObjectById('Camera') : this.gameEngine.editorGameObject;
            const camera = cameraGameObject.getBehaviour(Camera)
            const viewportMatrix = camera.calculateViewportMatrix()
            const originPoint = { x: event.clientX, y: event.clientY };
            const globalPoint = pointAppendMatrix(originPoint, invertMatrix(viewportMatrix));
            let result = this.hitTest(this.rootGameObject, globalPoint);
            if (result) {
                while (result) {
                    if (code === 0) {    // 左键
                        // 如果有onClick事件，callback = onClick，否则callback = onMouseLeftDown
                        this.callback = result.onMouseLeftDown ? result.onMouseLeftDown : result.onClick;
                    }
                    else if (code === 1) {   // 中键
                        this.callback = result.onMouseMiddleDown;
                    }
                    else if (code === 2) {   // 右键
                        this.callback = result.onMouseRightDown;
                    }

                    if (this.callback) {
                        const invertGlobalMatrix = invertMatrix(result.getBehaviour(Transform).globalMatrix)
                        const localPoint = pointAppendMatrix(globalPoint, invertGlobalMatrix)
                        const event: GameEngineMouseEvent = {
                            globalX: globalPoint.x,
                            globalY: globalPoint.y,
                            localX: localPoint.x,
                            localY: localPoint.y
                        }
                        this.callback(event);
                    }
                    result = result.parent;
                }
            }
            else {
                //TODO 遗留未修改
                if (this.rootGameObject.onClick) {
                    const event: GameEngineMouseEvent = {
                        globalX: globalPoint.x,
                        globalY: globalPoint.y,
                        localX: globalPoint.x,
                        localY: globalPoint.y
                    }
                    this.rootGameObject.onClick(event);
                }
            }
        });

        // window.addEventListener('mousemove', (event) => {
        //     //TODO  理清楚这里的逻辑，是否为对比冒泡捕获存储的GameObject结构树
        //     // 检测鼠标进入
        //     const cameraGameObject = this.gameEngine.mode === 'play' ? getGameObjectById('Camera') : this.gameEngine.editorGameObject;
        //     const camera = cameraGameObject.getBehaviour(Camera)
        //     const viewportMatrix = camera.calculateViewportMatrix()
        //     const originPoint = { x: event.clientX, y: event.clientY };
        //     const globalPoint = pointAppendMatrix(originPoint, invertMatrix(viewportMatrix));

        //     let result = this.hitTest(this.rootGameObject, globalPoint);
        //     if (result) {
        //         while (result) {
        //             if(this.currentHoverGameObject !== result){
        //                 if (result.onMouseEnter) {
        //                     this.currentHoverGameObject = result;
        //                     const invertGlobalMatrix = invertMatrix(result.getBehaviour(Transform).globalMatrix)
        //                     const localPoint = pointAppendMatrix(globalPoint, invertGlobalMatrix)
        //                     const event: GameEngineMouseEvent = {
        //                         globalX: globalPoint.x,
        //                         globalY: globalPoint.y,
        //                         localX: localPoint.x,
        //                         localY: localPoint.y
        //                     }
        //                     result.onMouseEnter(event);
        //                 }
        //             }
        //             result = result.parent;
        //         }
        //     }
        //     else {
        //         if (this.rootGameObject.onMouseEnter) {
        //             const event: GameEngineMouseEvent = {
        //                 globalX: globalPoint.x,
        //                 globalY: globalPoint.y,
        //                 localX: globalPoint.x,
        //                 localY: globalPoint.y
        //             }
        //             this.rootGameObject.onMouseEnter(event);
        //         }
        //     }
        // });
    }

    hitTest(gameObject: GameObject, point: Point): GameObject {

        if (gameObject.renderer) {
            const hitArea = gameObject.renderer.getBounds();
            const hitAreaType = gameObject.renderer.hitAreaType;
            const result = this.checkPointInHitArea(point, hitAreaType, hitArea)
            if (result) {
                // console.log("hit", gameObject.id);
                return gameObject;
            }
            else {
                return null;
            }
        }
        else {
            const length = gameObject.children.length;
            for (let childIndex = length - 1; childIndex >= 0; childIndex--) {
                const child = gameObject.children[childIndex];
                const childTransform = child.getBehaviour(Transform);
                const childLocalMatrix = childTransform.localMatrix;
                const childInvertLocalMatrix = invertMatrix(childLocalMatrix);
                const newPoint = pointAppendMatrix(point, childInvertLocalMatrix);
                const result = this.hitTest(child, newPoint);
                if (result) {
                    return result;
                }
            }
            return null;
        }
    }

    checkPointInHitArea(point: Point, hitAreaType, hitArea){
        switch (hitAreaType) {
            case 'rectangle':
                return checkPointInRectangle(point, hitArea);
            case 'hexagon':
                return checkPointInHexagon(point, hitArea);
            case 'circle':
                return false;
            case 'none':
                return false;
            default:
                throw new Error('未知的hitAreaType,策划请检查.yaml文件并核对hitAreaType，开发请检查Renderer代码');
        }
    }
}