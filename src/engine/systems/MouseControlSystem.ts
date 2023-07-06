import { s } from "vitest/dist/types-2b1c412e";
import { Camera } from "../../behaviours/Camera";
import { GameEngineMouseEvent, GameObject, getGameObjectById } from "../../engine";
import { checkPointInCircle, checkPointInHexagon, checkPointInRectangle, Hexagon, invertMatrix, Point, pointAppendMatrix } from "../math";
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
                    // console.log("hit", result.id);
                    result = result.parent;
                }
            }
            else {
                if (code === 0) {    // 左键
                    // 如果有onClick事件，callback = onClick，否则callback = onMouseLeftDown
                    this.callback = this.rootGameObject.onMouseLeftDown ? this.rootGameObject.onMouseLeftDown : this.rootGameObject.onClick;
                }
                else if (code === 1) {   // 中键
                    this.callback = this.rootGameObject.onMouseMiddleDown;
                }
                else if (code === 2) {   // 右键
                    this.callback = this.rootGameObject.onMouseRightDown;
                }
                
                if (this.callback) {
                    const event: GameEngineMouseEvent = {
                        globalX: globalPoint.x,
                        globalY: globalPoint.y,
                        localX: globalPoint.x,
                        localY: globalPoint.y
                    }
                    this.callback(event);
                }
            }
        });

        window.addEventListener('mousemove', (event) => {
            const cameraGameObject = this.gameEngine.mode === 'play' ? getGameObjectById('Camera') : this.gameEngine.editorGameObject;
            const camera = cameraGameObject.getBehaviour(Camera)
            const viewportMatrix = camera.calculateViewportMatrix()
            const originPoint = { x: event.clientX, y: event.clientY };
            const globalPoint = pointAppendMatrix(originPoint, invertMatrix(viewportMatrix));
            let result = this.hitTest(this.rootGameObject, globalPoint);

            if(result){
                const invertGlobalMatrix = invertMatrix(result.getBehaviour(Transform).globalMatrix)
                const localPoint = pointAppendMatrix(globalPoint, invertGlobalMatrix)
                const event: GameEngineMouseEvent = {
                    globalX: globalPoint.x,
                    globalY: globalPoint.y,
                    localX: localPoint.x,
                    localY: localPoint.y
                }

                if(result !== this.currentHoverGameObject){
                    if(this.currentHoverGameObject && this.currentHoverGameObject.onMouseLeave){
                        this.currentHoverGameObject.onMouseLeave(event);
                        // console.log("leave", this.currentHoverGameObject.id);
                    }
                    this.currentHoverGameObject = result;
                    this.currentHoverGameObject.onMouseEnter(event);
                    // console.log("enter", this.currentHoverGameObject.id);
                }
            }
        });
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
                return checkPointInCircle(point, hitArea);
            case 'none':
                return false;
            default:
                throw new Error('未知的hitAreaType,策划请检查.yaml文件并核对hitAreaType，开发请检查Renderer代码');
        }
    }
}