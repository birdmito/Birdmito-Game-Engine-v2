import { GameObject, Matrix } from "../../engine";
import { BitmapRenderer } from "../BitmapRenderer";
import { matrixAppendMatrix } from "../math";
import { TextRenderer } from "../TextRenderer";
import { Transform } from "../Transform";
import { System } from "./System";

export class TransformSystem extends System {
    onUpdate(): void {
        function visit(gameObject: GameObject) {
            const transform = gameObject.getBehaviour(Transform)

            // 防御性编程——如果没有设置width和height，就设置为默认值
            if (transform.boundWidth === undefined) {
                transform.boundWidth = '100'
            }
            if (transform.boundHeight === undefined) {
                transform.boundHeight = '100'
            }
            transform.width = Number(transform.boundWidth)
            transform.height = Number(transform.boundHeight)
            // console.log(width, height)

            switch (transform.anchorType) {
                case 'left-top':
                    transform.anchor = { x: 0, y: 0 };
                    break;
                case 'center-top':
                    transform.anchor = { x: -transform.width / 2, y: 0 };
                    break;
                case 'right-top':
                    transform.anchor = { x: -transform.width, y: 0 };
                    break;
                case 'left-center':
                    transform.anchor = { x: 0, y: -transform.height / 2 };
                    break;
                case 'center':
                    transform.anchor = { x: -transform.width / 2, y: -transform.height / 2 };
                    break;
                case 'right-center':
                    transform.anchor = { x: -transform.width, y: -transform.height / 2 };
                    break;
                case 'left-bottom':
                    transform.anchor = { x: 0, y: -transform.height };
                    break;
                case 'center-bottom':
                    transform.anchor = { x: -transform.width / 2, y: -transform.height };
                    break;
                case 'right-bottom':
                    transform.anchor = { x: -transform.width, y: -transform.height };
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
}