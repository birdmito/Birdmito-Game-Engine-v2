import { GameObject, Matrix } from "../../engine";
import { matrixAppendMatrix } from "../math";
import { Transform } from "../Transform";
import { System } from "./System";

export class TransformSystem extends System {

    onUpdate(): void {
        function visit(gameObject: GameObject) {
            const transform = gameObject.getBehaviour(Transform)
            transform.localMatrix.updateFromTransformProperties(
                transform.x, transform.y, transform.scaleX, transform.scaleY, transform.rotation
            )
            const parent = gameObject.parent
            const parentGlobalMatrix = parent ? parent.getBehaviour(Transform).globalMatrix : new Matrix();
            transform.globalMatrix = matrixAppendMatrix(transform.localMatrix, parentGlobalMatrix);
            for (const child of gameObject.children) {
                visit(child);
            }
        }
        visit(this.rootGameObject)
        visit(this.gameEngine.editorGameObject)
    }
}