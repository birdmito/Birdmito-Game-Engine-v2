import { Camera } from "../../behaviours/Camera";
import { GameEngineMouseEvent, GameObject, getGameObjectById } from "../../engine";
import { checkPointInRectangle, invertMatrix, Point, pointAppendMatrix } from "../math";
import { Transform } from "../Transform";
import { System } from "./System";


export class MouseControlSystem extends System {

    onStart() {
        window.addEventListener('mousedown', (e) => {

            const cameraGameObject = this.gameEngine.mode === 'play' ? getGameObjectById('camera') : this.gameEngine.editorGameObject;
            const camera = cameraGameObject.getBehaviour(Camera)
            const viewportMatrix = camera.calculateViewportMatrix()
            const originPoint = { x: e.clientX, y: e.clientY };
            const globalPoint = pointAppendMatrix(originPoint, invertMatrix(viewportMatrix))
            let result = this.hitTest(this.rootGameObject, globalPoint);
            if (result) {
                while (result) {
                    if (result.onClick) {
                        const invertGlobalMatrix = invertMatrix(result.getBehaviour(Transform).globalMatrix)
                        const localPoint = pointAppendMatrix(globalPoint, invertGlobalMatrix)
                        const event: GameEngineMouseEvent = {
                            globalX: globalPoint.x,
                            globalY: globalPoint.y,
                            localX: localPoint.x,
                            localY: localPoint.y
                        }
                        result.onClick(event);
                    }
                    result = result.parent;
                }
            }
            else {
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
    }

    hitTest(gameObject: GameObject, point: Point): GameObject {

        if (gameObject.renderer) {
            const rectangle = gameObject.renderer.getBounds();
            const result = checkPointInRectangle(point, rectangle)
            if (result) {
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
}