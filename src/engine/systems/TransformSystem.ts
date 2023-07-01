import { GameObject, Matrix } from "../../engine";
import { matrixAppendMatrix } from "../math";
import { Transform } from "../Transform";
import { System } from "./System";

export class TransformSystem extends System {
    onUpdate(): void {
        function visit(gameObject: GameObject) {
            const transform = gameObject.getBehaviour(Transform)

            // 防御性编程——如果没有设置width和height，就设置为默认值
            if (transform.width === undefined) {
                transform.width = '100'
            }
            if (transform.height === undefined) {
                transform.height = '100'
            }
            const width = Number(transform.width)
            const height = Number(transform.height)
            // console.log(width, height)

            switch (transform.anchorType) {
                case 'left-top':
                    transform.anchor = { x: 0, y: 0 };
                    break;
                case 'center-top':
                    transform.anchor = { x: -width / 2, y: 0 };
                    break;
                case 'right-top':
                    transform.anchor = { x: -width, y: 0 };
                    break;
                case 'left-center':
                    transform.anchor = { x: 0, y: -height / 2 };
                    break;
                case 'center':
                    transform.anchor = { x: -width / 2, y: -height / 2 };
                    break;
                case 'right-center':
                    transform.anchor = { x: -width, y: -height / 2 };
                    break;
                case 'left-bottom':
                    transform.anchor = { x: 0, y: -height };
                    break;
                case 'center-bottom':
                    transform.anchor = { x: -width / 2, y: -height };
                    break;
                case 'right-bottom':
                    transform.anchor = { x: -width, y: -height };
                    break;
                default:
                    transform.anchor = { x: 0, y: 0 };
                    break;
            }

            transform.localMatrix.updateFromTransformProperties(
                transform.x + transform.anchor.x, transform.y + transform.anchor.y, transform.scaleX, transform.scaleY, transform.rotation
            )
            // transform.localMatrix.updateFromTransformProperties(
            //     transform.x, transform.y, transform.scaleX, transform.scaleY, transform.rotation
            // )
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

    setAnchor(anchorType):{ x: number, y: number } {
        switch (anchorType) {
            case 'left-top':
                return { x: 0, y: 0 };
            default:
                return { x: 0, y: 0 };
        }
    }
}