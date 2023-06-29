import { Matrix } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { invertMatrix, matrixAppendMatrix } from "../engine/math";
import { Transform } from "../engine/Transform";

export class Camera extends Behaviour {
    viewportWidth: number = 960;
    viewportHeight: number = 540;

    constructor() {
        super();
    }

    onStart(): void {
        console.log("camera start");
    }

    calculateViewportMatrix() {
        const cameraTransform = this.gameObject.getBehaviour(Transform);
        const offsetMatrix = new Matrix(1, 0, 0, 1, 0, 0);
        let viewportMatrix = invertMatrix(matrixAppendMatrix(cameraTransform.globalMatrix, offsetMatrix));
        return viewportMatrix;
    }
}
